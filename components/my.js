// 个人中心组件
const MyComponent = {
    template: `
        <div>
        <h4>我的</h4>
        <div class="mt-4">
            <div class="card mb-4">
                <div class="card-header">
                    <h6>个人信息</h6>
                </div>
                <div class="card-body">
                    <p><strong>昵称：</strong> {{ $parent.userInfo.nickname }}</p>
                    <p><strong>手机号：</strong> {{ $parent.userInfo.phone }}</p>
                    <p><strong>真实姓名：</strong> {{ $parent.userInfo.realName }}</p>
                    <p><strong>班级：</strong> {{ $parent.userInfo.className }}</p>
                    <p><strong>学号：</strong> {{ $parent.userInfo.studentID }}</p>
                </div>
            </div>
            
            <!-- 标签页 -->
            <div class="card">
                <div class="card-header">
                    <ul class="nav nav-tabs card-header-tabs">
                        <li class="nav-item">
                            <a class="nav-link" :class="{ active: activeTab === 'myProducts' }" @click="activeTab = 'myProducts'">我的商品</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" :class="{ active: activeTab === 'purchaseRecords' }" @click="activeTab = 'purchaseRecords'">购买记录</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" :class="{ active: activeTab === 'browseRecords' }" @click="activeTab = 'browseRecords'">浏览记录</a>
                        </li>
                    </ul>
                </div>
                <div class="card-body">
                    <!-- 我的商品 -->
                    <div v-if="activeTab === 'myProducts'">
                        <!-- 当没有发布商品时显示 -->
                        <div v-if="myProducts.length === 0">
                            <p>您还没有发布商品，<a href="#" @click="$parent.goToPublish">点击发布</a></p>
                        </div>
                        <!-- 当有发布商品时显示 -->
                        <div v-else>
                            <div class="row">
                                <div class="col-md-4" v-for="product in myProducts" :key="product.id">
                                    <div class="product-card">
                                        <img :src="product.image" alt="商品图片" @click="goToProduct(product)">
                                        <div class="product-info">
                                            <h5 @click="goToProduct(product)" style="cursor: pointer;">{{ product.title }}</h5>
                                            <p class="text-muted">{{ product.description }}</p>
                                            <p class="product-price">{{ product.price }}</p>
                                            <div class="d-flex justify-content-between">
                                                <span>发布时间：{{ formatDate(product.createdAt) }}</span>
                                                <button class="btn btn-sm btn-primary" @click="goToProduct(product)">查看详情</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 购买记录 -->
                    <div v-else-if="activeTab === 'purchaseRecords'">
                        <!-- 当没有购买记录时显示 -->
                        <div v-if="purchaseRecords.length === 0">
                            <p>您还没有购买记录</p>
                        </div>
                        <!-- 当有购买记录时显示 -->
                        <div v-else>
                            <div class="row">
                                <div class="col-md-4" v-for="record in purchaseRecords" :key="record.id">
                                    <div class="product-card">
                                        <img :src="record.productImage" alt="商品图片" @click="goToProductByRecord(record)">
                                        <div class="product-info">
                                            <h5 @click="goToProductByRecord(record)" style="cursor: pointer;">{{ record.productTitle }}</h5>
                                            <p class="product-price">{{ record.productPrice }}</p>
                                            <div class="mt-2">
                                                <span class="badge" :class="getStatusClass(record.status)">{{ record.status }}</span>
                                            </div>
                                            <div class="mt-2">
                                                <span>购买时间：{{ formatDate(record.purchaseTime) }}</span>
                                            </div>
                                            <div class="mt-3 d-flex justify-content-between">
                                                <button class="btn btn-sm btn-info" @click="showTradeProgress(record)">查看交易进度</button>
                                                <button class="btn btn-sm btn-danger" @click="deleteOrder(record)">删除订单</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 浏览记录 -->
                    <div v-else-if="activeTab === 'browseRecords'">
                        <!-- 当没有浏览记录时显示 -->
                        <div v-if="browseRecords.length === 0">
                            <p>您还没有浏览记录</p>
                        </div>
                        <!-- 当有浏览记录时显示 -->
                        <div v-else>
                            <div class="row">
                                <div class="col-md-4" v-for="record in browseRecords" :key="record.id">
                                    <div class="product-card">
                                        <img :src="record.productImage" alt="商品图片" @click="goToProductByBrowse(record)">
                                        <div class="product-info">
                                            <h5 @click="goToProductByBrowse(record)" style="cursor: pointer;">{{ record.productTitle }}</h5>
                                            <p class="product-price">{{ record.productPrice }}</p>
                                            <div class="mt-2">
                                                <span>浏览时间：{{ formatDate(record.browseTime) }}</span>
                                            </div>
                                            <div class="mt-3">
                                                <button class="btn btn-sm btn-primary" @click="goToProductByBrowse(record)">查看详情</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 交易进度模态框 -->
        <div v-if="showProgressModal" class="modal" tabindex="-1" role="dialog" :class="{ show: showProgressModal }" style="display: block;">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">交易进度</h5>
                        <button type="button" class="btn-close" @click="showProgressModal = false"></button>
                    </div>
                    <div class="modal-body" v-if="currentRecord">
                        <h6>{{ currentRecord.productTitle }}</h6>
                        <p class="text-muted">价格：{{ currentRecord.productPrice }}</p>
                        
                        <div class="mt-4">
                            <h7>交易状态：</h7>
                            <span class="badge" :class="getStatusClass(currentRecord.status)">{{ currentRecord.status }}</span>
                        </div>
                        
                        <div class="mt-4">
                            <h7>交易进度：</h7>
                            <div class="mt-2">
                                <div class="d-flex align-items-center mb-2">
                                    <div class="circle" :class="{ completed: currentRecord.hasPaid }"></div>
                                    <div class="line" :class="{ completed: currentRecord.hasPaid && currentRecord.hasShipped }"></div>
                                    <div class="circle" :class="{ completed: currentRecord.hasShipped }"></div>
                                    <div class="line" :class="{ completed: currentRecord.hasShipped && currentRecord.hasReceived }"></div>
                                    <div class="circle" :class="{ completed: currentRecord.hasReceived }"></div>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <span>买家已付款</span>
                                    <span>卖家已发货</span>
                                    <span>买家已收货</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mt-4">
                            <h7>进度详情：</h7>
                            <ul class="list-group mt-2">
                                <li class="list-group-item">
                                    <span>买家是否已付款：</span>
                                    <span :class="{ 'text-success': currentRecord.hasPaid, 'text-danger': !currentRecord.hasPaid }">
                                        {{ currentRecord.hasPaid ? '是' : '否' }}
                                    </span>
                                </li>
                                <li class="list-group-item">
                                    <span>卖家是否已发货：</span>
                                    <span :class="{ 'text-success': currentRecord.hasShipped, 'text-danger': !currentRecord.hasShipped }">
                                        {{ currentRecord.hasShipped ? '是' : '否' }}
                                    </span>
                                </li>
                                <li class="list-group-item">
                                    <span>买家是否已收货：</span>
                                    <span :class="{ 'text-success': currentRecord.hasReceived, 'text-danger': !currentRecord.hasReceived }">
                                        {{ currentRecord.hasReceived ? '是' : '否' }}
                                    </span>
                                </li>
                            </ul>
                        </div>
                        
                        <!-- 操作按钮 -->
                        <div class="mt-4">
                            <h7>操作：</h7>
                            <div class="mt-2">
                                <!-- 买家操作 -->
                                <template v-if="isBuyer(currentRecord)">
                                    <button v-if="!currentRecord.hasPaid" class="btn btn-sm btn-primary me-2" @click="updateTradeStatus(currentRecord, 'hasPaid')">确认付款</button>
                                    <button v-if="currentRecord.hasShipped && !currentRecord.hasReceived" class="btn btn-sm btn-success me-2" @click="updateTradeStatus(currentRecord, 'hasReceived')">确认收货</button>
                                    <button v-if="!currentRecord.hasReceived && currentRecord.status !== '交易取消'" class="btn btn-sm btn-danger me-2" @click="cancelTrade(currentRecord)">取消交易</button>
                                </template>
                                <!-- 卖家操作 -->
                                <template v-else-if="isSeller(currentRecord)">
                                    <button v-if="currentRecord.hasPaid && !currentRecord.hasShipped" class="btn btn-sm btn-warning me-2" @click="updateTradeStatus(currentRecord, 'hasShipped')">确认发货</button>
                                    <button v-if="!currentRecord.hasShipped && currentRecord.status !== '交易取消'" class="btn btn-sm btn-danger me-2" @click="cancelTrade(currentRecord)">取消交易</button>
                                </template>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="showProgressModal = false">关闭</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- 模态框背景 -->
        <div v-if="showProgressModal" class="modal-backdrop fade show"></div>
    </div>
    `,
    data() {
        return {
            myProducts: [],
            purchaseRecords: [],
            browseRecords: [],
            activeTab: 'myProducts',
            showProgressModal: false,
            currentRecord: null
        };
    },
    mounted() {
        this.loadMyProducts();
        this.loadPurchaseRecords();
        this.loadBrowseRecords();
    },
    methods: {
        loadMyProducts() {
            // 获取当前用户信息
            const storedUser = localStorage.getItem('userInfo');
            if (!storedUser) {
                return;
            }
            const userInfo = JSON.parse(storedUser);
            // 确保ID类型一致
            const currentUserId = parseInt(userInfo.id);

            // 从 localStorage 获取所有商品数据
            const storedProducts = localStorage.getItem('products');
            if (storedProducts) {
                const allProducts = JSON.parse(storedProducts);
                // 筛选出当前用户发布的商品，确保ID类型一致
                this.myProducts = allProducts.filter(product => parseInt(product.sellerId) === currentUserId);
            }
        },
        loadPurchaseRecords() {
            // 获取当前用户信息
            const storedUser = localStorage.getItem('userInfo');
            if (!storedUser) {
                return;
            }
            const userInfo = JSON.parse(storedUser);
            const currentUserId = parseInt(userInfo.id);

            // 从 localStorage 获取所有购买记录
            const storedRecords = localStorage.getItem('purchaseRecords');
            if (storedRecords) {
                const allRecords = JSON.parse(storedRecords);
                // 筛选出当前用户作为买家或卖家的记录
                this.purchaseRecords = allRecords.filter(record =>
                    parseInt(record.buyerId) === currentUserId || parseInt(record.sellerId) === currentUserId
                );
            }
        },
        loadBrowseRecords() {
            // 获取当前用户信息
            const storedUser = localStorage.getItem('userInfo');
            if (!storedUser) {
                return;
            }
            const userInfo = JSON.parse(storedUser);
            const currentUserId = parseInt(userInfo.id);

            // 从 localStorage 获取所有浏览记录
            const storedRecords = localStorage.getItem('browseRecords');
            if (storedRecords) {
                this.browseRecords = JSON.parse(storedRecords);
            }
        },
        goToProduct(product) {
            // 保存当前商品信息到localStorage
            localStorage.setItem('currentProduct', JSON.stringify(product));
            // 跳转到商品详情页
            this.$router.push(`/product/${product.id}`);
        },
        goToProductByRecord(record) {
            // 根据商品ID获取商品详情
            const storedProducts = localStorage.getItem('products');
            if (storedProducts) {
                const allProducts = JSON.parse(storedProducts);
                const product = allProducts.find(p => p.id === record.productId);
                if (product) {
                    localStorage.setItem('currentProduct', JSON.stringify(product));
                    this.$router.push(`/product/${product.id}`);
                }
            }
        },
        goToProductByBrowse(record) {
            // 根据商品ID获取商品详情
            const storedProducts = localStorage.getItem('products');
            if (storedProducts) {
                const allProducts = JSON.parse(storedProducts);
                const product = allProducts.find(p => p.id === record.productId);
                if (product) {
                    localStorage.setItem('currentProduct', JSON.stringify(product));
                    this.$router.push(`/product/${product.id}`);
                }
            }
        },
        showTradeProgress(record) {
            this.currentRecord = record;
            this.showProgressModal = true;
        },
        updateTradeStatus(record, statusKey) {
            // 更新交易状态
            record[statusKey] = true;

            // 更新交易状态文本
            let isCompleted = false;
            if (record.hasPaid && !record.hasShipped) {
                record.status = "已付款，待发货";
            } else if (record.hasPaid && record.hasShipped && !record.hasReceived) {
                record.status = "已发货，待收货";
            } else if (record.hasPaid && record.hasShipped && record.hasReceived) {
                record.status = "交易完成";
                isCompleted = true;
            }

            // 更新localStorage中的数据
            const storedRecords = localStorage.getItem('purchaseRecords');
            if (storedRecords) {
                let records = JSON.parse(storedRecords);
                const index = records.findIndex(r => r.id === record.id);
                if (index !== -1) {
                    records[index] = record;
                    localStorage.setItem('purchaseRecords', JSON.stringify(records));
                    // 重新加载购买记录
                    this.loadPurchaseRecords();
                }
            }

            // 交易完成后删除对应商品
            if (isCompleted) {
                this.deleteProductAfterTrade(record.productId);
            }
        },
        deleteProductAfterTrade(productId) {
            // 从localStorage获取所有商品
            const storedProducts = localStorage.getItem('products');
            if (storedProducts) {
                let products = JSON.parse(storedProducts);
                // 找到并删除对应的商品
                const updatedProducts = products.filter(p => p.id !== productId);
                localStorage.setItem('products', JSON.stringify(updatedProducts));
            }
        },
        deleteOrder(record) {
            if (confirm('确定要删除这笔订单吗？')) {
                // 从localStorage中删除订单
                const storedRecords = localStorage.getItem('purchaseRecords');
                if (storedRecords) {
                    let records = JSON.parse(storedRecords);
                    // 过滤掉要删除的订单
                    const updatedRecords = records.filter(r => r.id !== record.id);
                    localStorage.setItem('purchaseRecords', JSON.stringify(updatedRecords));
                    // 重新加载购买记录
                    this.loadPurchaseRecords();
                    // 显示成功消息
                    alert('订单已删除');
                }
            }
        },
        cancelTrade(record) {
            if (confirm('确定要取消这笔交易吗？')) {
                // 更新交易状态为取消
                record.status = "交易取消";

                // 更新localStorage中的数据
                const storedRecords = localStorage.getItem('purchaseRecords');
                if (storedRecords) {
                    let records = JSON.parse(storedRecords);
                    const index = records.findIndex(r => r.id === record.id);
                    if (index !== -1) {
                        records[index] = record;
                        localStorage.setItem('purchaseRecords', JSON.stringify(records));
                        // 重新加载购买记录
                        this.loadPurchaseRecords();
                        // 关闭模态框
                        this.showProgressModal = false;
                        // 显示成功消息
                        alert('交易已取消');
                    }
                }
            }
        },
        getStatusClass(status) {
            switch (status) {
                case '待付款':
                    return 'bg-warning text-dark';
                case '已付款，待发货':
                    return 'bg-info text-white';
                case '已发货，待收货':
                    return 'bg-primary text-white';
                case '交易完成':
                    return 'bg-success text-white';
                case '交易取消':
                    return 'bg-danger text-white';
                default:
                    return 'bg-secondary text-white';
            }
        },
        isBuyer(record) {
            const storedUser = localStorage.getItem('userInfo');
            if (!storedUser) {
                return false;
            }
            const userInfo = JSON.parse(storedUser);
            return parseInt(userInfo.id) === record.buyerId;
        },
        isSeller(record) {
            const storedUser = localStorage.getItem('userInfo');
            if (!storedUser) {
                return false;
            }
            const userInfo = JSON.parse(storedUser);
            return parseInt(userInfo.id) === record.sellerId;
        },
        formatDate(timestamp) {
            // 如果商品没有createdAt字段，返回默认值
            if (!timestamp) {
                return '未知';
            }
            const date = new Date(timestamp);
            return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        }
    }
};