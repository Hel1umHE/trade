// 购买记录页面组件
const MyPurchaseComponent = {
    template: `
        <div>
            <h4>购买记录</h4>
            <div class="mt-4">
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
                                    <div class="progress-container">
                                        <div class="progress-step">
                                            <div class="circle" :class="{ completed: currentRecord.hasPaid }"></div>
                                            <span>买家已付款</span>
                                        </div>
                                        <div class="progress-step">
                                            <div class="circle" :class="{ completed: currentRecord.hasShipped }"></div>
                                            <span>卖家已发货</span>
                                        </div>
                                        <div class="progress-step">
                                            <div class="circle" :class="{ completed: currentRecord.hasReceived }"></div>
                                            <span>买家已收货</span>
                                        </div>
                                        <div class="line-container">
                                            <div class="line" :class="{ completed: currentRecord.hasPaid && currentRecord.hasShipped }"></div>
                                            <div class="line" :class="{ completed: currentRecord.hasShipped && currentRecord.hasReceived }"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mt-4">
                                <h7>进度详情：</h7>
                                <div class="mt-2">
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
            purchaseRecords: [],
            showProgressModal: false,
            currentRecord: null
        };
    },
    mounted() {
        this.loadPurchaseRecords();
    },
    methods: {
        loadPurchaseRecords() {
            // 获取当前用户信息
            const storedUser = localStorage.getItem('userInfo');
            if (!storedUser) {
                return;
            }
            const userInfo = JSON.parse(storedUser);
            const currentUserId = parseInt(userInfo.id);

            try {
                // 从 localStorage 获取所有购买记录
                const storedRecords = localStorage.getItem('purchaseRecords');
                if (storedRecords) {
                    const allRecords = JSON.parse(storedRecords);
                    // 筛选出当前用户作为买家或卖家的记录
                    const userRecords = allRecords.filter(record =>
                        parseInt(record.buyerId) === currentUserId || parseInt(record.sellerId) === currentUserId
                    );

                    // 获取所有商品数据
                    const storedProducts = localStorage.getItem('products');
                    const allProducts = storedProducts ? JSON.parse(storedProducts) : [];

                    // 为每条购买记录补充完整商品信息
                    this.purchaseRecords = userRecords.map(record => {
                        const product = allProducts.find(p => p.id === record.productId) || {};
                        // 合并购买记录和商品信息
                        return {
                            ...record,
                            productTitle: product.title || '未知商品',
                            productPrice: product.price || '¥0.00',
                            productImage: product.image || 'https://dummyimage.com/300x200/000/fff'
                        };
                    });
                }
            } catch (error) {
                console.error('加载购买记录失败:', error);
                this.purchaseRecords = [];
            }
        },
        goToProductByRecord(record) {
            // 根据商品ID获取商品详情
            const storedProducts = localStorage.getItem('products');
            if (storedProducts) {
                const allProducts = JSON.parse(storedProducts);
                const product = allProducts.find(p => p.id === record.productId);
                if (product) {
                    // 只保存商品ID到localStorage，避免localStorage容量超限
                    localStorage.setItem('currentProductId', product.id.toString());
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
                try {
                    let records = JSON.parse(storedRecords);
                    const index = records.findIndex(r => r.id === record.id);
                    if (index !== -1) {
                        // 只保存必要的字段回localStorage，避免冗余数据
                        const updatedRecord = {
                            id: record.id,
                            productId: record.productId,
                            buyerId: record.buyerId,
                            sellerId: record.sellerId,
                            buyerName: record.buyerName,
                            sellerName: record.sellerName,
                            purchaseTime: record.purchaseTime,
                            hasPaid: record.hasPaid,
                            hasShipped: record.hasShipped,
                            hasReceived: record.hasReceived,
                            status: record.status
                        };
                        records[index] = updatedRecord;
                        localStorage.setItem('purchaseRecords', JSON.stringify(records));
                        // 重新加载购买记录
                        this.loadPurchaseRecords();
                    }
                } catch (error) {
                    console.error('更新购买记录失败:', error);
                    // 使用 Bootstrap 轻量弹框提示操作失败
                    const toast = document.createElement('div');
                    toast.className = 'toast align-items-center text-bg-danger border-0 position-fixed top-0 end-0 m-3';
                    toast.setAttribute('role', 'alert');
                    toast.setAttribute('aria-live', 'assertive');
                    toast.setAttribute('aria-atomic', 'true');
                    toast.innerHTML = `
                        <div class="d-flex">
                            <div class="toast-body">操作失败，请稍后重试</div>
                            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                        </div>
                    `;
                    document.body.appendChild(toast);
                    const bsToast = new bootstrap.Toast(toast);
                    bsToast.show();
                    toast.addEventListener('hidden.bs.toast', () => toast.remove());
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
                try {
                    // 从localStorage中删除订单
                    const storedRecords = localStorage.getItem('purchaseRecords');
                    if (storedRecords) {
                        let records = JSON.parse(storedRecords);
                        // 过滤掉要删除的订单
                        const updatedRecords = records.filter(r => r.id !== record.id);
                        localStorage.setItem('purchaseRecords', JSON.stringify(updatedRecords));
                        // 重新加载购买记录
                        this.loadPurchaseRecords();
                        // 使用 Bootstrap 轻量弹框提示删除成功
                        const toast = document.createElement('div');
                        toast.className = 'toast align-items-center text-bg-success border-0 position-fixed top-0 end-0 m-3';
                        toast.setAttribute('role', 'alert');
                        toast.setAttribute('aria-live', 'assertive');
                        toast.setAttribute('aria-atomic', 'true');
                        toast.innerHTML = `
                            <div class="d-flex">
                                <div class="toast-body">订单已删除</div>
                                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                            </div>
                        `;
                        document.body.appendChild(toast);
                        const bsToast = new bootstrap.Toast(toast);
                        bsToast.show();
                        toast.addEventListener('hidden.bs.toast', () => toast.remove());
                    }
                } catch (error) {
                    console.error('删除订单失败:', error);
                    // 使用 Bootstrap 轻量弹框提示删除失败
                    const toast = document.createElement('div');
                    toast.className = 'toast align-items-center text-bg-danger border-0 position-fixed top-0 end-0 m-3';
                    toast.setAttribute('role', 'alert');
                    toast.setAttribute('aria-live', 'assertive');
                    toast.setAttribute('aria-atomic', 'true');
                    toast.innerHTML = `
                        <div class="d-flex">
                            <div class="toast-body">删除订单失败，请稍后重试</div>
                            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                        </div>
                    `;
                    document.body.appendChild(toast);
                    const bsToast = new bootstrap.Toast(toast);
                    bsToast.show();
                    toast.addEventListener('hidden.bs.toast', () => toast.remove());
                }
            }
        },
        cancelTrade(record) {
            if (confirm('确定要取消这笔交易吗？')) {
                try {
                    // 更新交易状态为取消
                    record.status = "交易取消";

                    // 更新localStorage中的数据
                    const storedRecords = localStorage.getItem('purchaseRecords');
                    if (storedRecords) {
                        let records = JSON.parse(storedRecords);
                        const index = records.findIndex(r => r.id === record.id);
                        if (index !== -1) {
                            // 只保存必要的字段回localStorage
                            const updatedRecord = {
                                id: record.id,
                                productId: record.productId,
                                buyerId: record.buyerId,
                                sellerId: record.sellerId,
                                buyerName: record.buyerName,
                                sellerName: record.sellerName,
                                purchaseTime: record.purchaseTime,
                                hasPaid: record.hasPaid,
                                hasShipped: record.hasShipped,
                                hasReceived: record.hasReceived,
                                status: record.status
                            };
                            records[index] = updatedRecord;
                            localStorage.setItem('purchaseRecords', JSON.stringify(records));
                            // 重新加载购买记录
                            this.loadPurchaseRecords();
                            // 关闭模态框
                            this.showProgressModal = false;
                            // 使用 Bootstrap 轻量弹框提示取消成功
                            const toast = document.createElement('div');
                            toast.className = 'toast align-items-center text-bg-success border-0 position-fixed top-0 end-0 m-3';
                            toast.setAttribute('role', 'alert');
                            toast.setAttribute('aria-live', 'assertive');
                            toast.setAttribute('aria-atomic', 'true');
                            toast.innerHTML = `
                                <div class="d-flex">
                                    <div class="toast-body">交易已取消</div>
                                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                                </div>
                            `;
                            document.body.appendChild(toast);
                            const bsToast = new bootstrap.Toast(toast);
                            bsToast.show();
                            toast.addEventListener('hidden.bs.toast', () => toast.remove());
                        }
                    }
                } catch (error) {
                    console.error('取消交易失败:', error);
                    // 使用 Bootstrap 轻量弹框提示取消失败
                    const toast = document.createElement('div');
                    toast.className = 'toast align-items-center text-bg-danger border-0 position-fixed top-0 end-0 m-3';
                    toast.setAttribute('role', 'alert');
                    toast.setAttribute('aria-live', 'assertive');
                    toast.setAttribute('aria-atomic', 'true');
                    toast.innerHTML = `
                        <div class="d-flex">
                            <div class="toast-body">取消交易失败，请稍后重试</div>
                            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                        </div>
                    `;
                    document.body.appendChild(toast);
                    const bsToast = new bootstrap.Toast(toast);
                    bsToast.show();
                    toast.addEventListener('hidden.bs.toast', () => toast.remove());
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
            // 如果没有时间戳，返回默认值
            if (!timestamp) {
                return '未知';
            }
            const date = new Date(timestamp);
            return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        }
    }
};