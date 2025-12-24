// 卖家订单跟踪组件
const SellerOrdersComponent = {
    template: `
        <div>
            <h4>卖家订单管理</h4>
            <div class="mt-4">
                <div class="card">
                    <div class="card-header">
                        <h6>我的订单</h6>
                    </div>
                    <div class="card-body">
                        <!-- 当没有订单时显示 -->
                        <div v-if="sellerOrders.length === 0">
                            <p>您还没有卖出商品，暂无订单</p>
                        </div>
                        <!-- 当有订单时显示 -->
                        <div v-else>
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>订单号</th>
                                        <th>商品信息</th>
                                        <th>买家</th>
                                        <th>订单状态</th>
                                        <th>下单时间</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="order in sellerOrders" :key="order.id">
                                        <td>{{ order.id }}</td>
                                        <td>
                                            <div class="d-flex align-items-center">
                                                <img :src="order.productImage" alt="商品图片" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; margin-right: 10px;">
                                                <div>
                                                    <div>{{ order.productTitle }}</div>
                                                    <div class="text-muted product-price">{{ order.productPrice }}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{{ order.buyerName }}</td>
                                        <td>
                                            <span class="badge" :class="getStatusClass(order.status)">{{ order.status }}</span>
                                        </td>
                                        <td>{{ formatDate(order.purchaseTime) }}</td>
                                        <td>
                                            <button class="btn btn-sm btn-info" @click="showTradeProgress(order)">查看详情</button>
                                            <button class="btn btn-sm btn-danger ml-1" @click="deleteOrder(order)">删除订单</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 交易进度模态框 -->
            <div v-if="showProgressModal" class="modal" tabindex="-1" role="dialog" :class="{ show: showProgressModal }" style="display: block;">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">订单详情 - 订单号：{{ currentOrder?.id }}</h5>
                            <button type="button" class="btn-close" @click="showProgressModal = false"></button>
                        </div>
                        <div class="modal-body" v-if="currentOrder">
                            <h6>{{ currentOrder.productTitle }}</h6>
                            <p class="text-muted">价格：{{ currentOrder.productPrice }}</p>
                            
                            <div class="mt-4">
                                <h7>订单状态：</h7>
                                <span class="badge" :class="getStatusClass(currentOrder.status)">{{ currentOrder.status }}</span>
                            </div>
                            
                            <div class="mt-4">
                                <h7>订单进度：</h7>
                                <div class="mt-2">
                                    <div class="progress-container">
                                        <div class="progress-step">
                                            <div class="circle" :class="{ completed: currentOrder.hasPaid }"></div>
                                            <span>买家已付款</span>
                                        </div>
                                        <div class="progress-step">
                                            <div class="circle" :class="{ completed: currentOrder.hasShipped }"></div>
                                            <span>卖家已发货</span>
                                        </div>
                                        <div class="progress-step">
                                            <div class="circle" :class="{ completed: currentOrder.hasReceived }"></div>
                                            <span>买家已收货</span>
                                        </div>
                                        <div class="line-container">
                                            <div class="line" :class="{ completed: currentOrder.hasPaid && currentOrder.hasShipped }"></div>
                                            <div class="line" :class="{ completed: currentOrder.hasShipped && currentOrder.hasReceived }"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mt-4">
                                <h7>进度详情：</h7>
                                <ul class="list-group mt-2">
                                    <li class="list-group-item">
                                        <span>买家是否已付款：</span>
                                        <span :class="{ 'text-success': currentOrder.hasPaid, 'text-danger': !currentOrder.hasPaid }">
                                            {{ currentOrder.hasPaid ? '是' : '否' }}
                                        </span>
                                    </li>
                                    <li class="list-group-item">
                                        <span>卖家是否已发货：</span>
                                        <span :class="{ 'text-success': currentOrder.hasShipped, 'text-danger': !currentOrder.hasShipped }">
                                            {{ currentOrder.hasShipped ? '是' : '否' }}
                                        </span>
                                    </li>
                                    <li class="list-group-item">
                                        <span>买家是否已收货：</span>
                                        <span :class="{ 'text-success': currentOrder.hasReceived, 'text-danger': !currentOrder.hasReceived }">
                                            {{ currentOrder.hasReceived ? '是' : '否' }}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                            
                            <!-- 操作按钮 -->
                            <div class="mt-4">
                                <h7>操作：</h7>
                                <div class="mt-2">
                                    <!-- 卖家操作 -->
                                    <template v-if="isSeller(currentOrder)">
                                        <button v-if="currentOrder.hasPaid && !currentOrder.hasShipped" class="btn btn-sm btn-warning me-2" @click="updateTradeStatus(currentOrder, 'hasShipped')">确认发货</button>
                                        <button v-if="!currentOrder.hasShipped && currentOrder.status !== '交易取消'" class="btn btn-sm btn-danger me-2" @click="cancelTrade(currentOrder)">取消交易</button>
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
            sellerOrders: [],
            showProgressModal: false,
            currentOrder: null
        };
    },
    mounted() {
        this.loadSellerOrders();
    },
    methods: {
        loadSellerOrders() {
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
                    // 筛选出当前用户作为卖家的记录
                    const sellerRecords = allRecords.filter(record => parseInt(record.sellerId) === currentUserId);

                    // 获取所有商品数据
                    const storedProducts = localStorage.getItem('products');
                    const allProducts = storedProducts ? JSON.parse(storedProducts) : [];

                    // 为每条订单补充完整商品信息，优先使用购买记录中保存的商品信息
                    this.sellerOrders = sellerRecords.map(order => {
                        const product = allProducts.find(p => p.id === order.productId) || {};
                        // 合并订单和商品信息，优先使用订单中已保存的商品信息
                        return {
                            ...order,
                            productTitle: order.productTitle || product.title || '未知商品',
                            productPrice: order.productPrice || product.price || '¥0.00',
                            productImage: order.productImage || product.image || 'https://dummyimage.com/50x50/000/fff'
                        };
                    });
                }
            } catch (error) {
                console.error('加载卖家订单失败:', error);
                this.sellerOrders = [];
            }
        },
        showTradeProgress(order) {
            this.currentOrder = order;
            this.showProgressModal = true;
        },
        updateTradeStatus(order, statusKey) {
            // 更新交易状态
            order[statusKey] = true;

            // 更新交易状态文本
            let isCompleted = false;
            if (order.hasPaid && !order.hasShipped) {
                order.status = "已付款，待发货";
            } else if (order.hasPaid && order.hasShipped && !order.hasReceived) {
                order.status = "已发货，待收货";
            } else if (order.hasPaid && order.hasShipped && order.hasReceived) {
                order.status = "交易完成";
                isCompleted = true;
            }

            // 更新localStorage中的数据
            const storedRecords = localStorage.getItem('purchaseRecords');
            if (storedRecords) {
                try {
                    let records = JSON.parse(storedRecords);
                    const index = records.findIndex(r => r.id === order.id);
                    if (index !== -1) {
                        // 更新订单，包含商品信息
                        const updatedOrder = {
                            id: order.id,
                            productId: order.productId,
                            buyerId: order.buyerId,
                            sellerId: order.sellerId,
                            buyerName: order.buyerName,
                            sellerName: order.sellerName,
                            purchaseTime: order.purchaseTime,
                            hasPaid: order.hasPaid,
                            hasShipped: order.hasShipped,
                            hasReceived: order.hasReceived,
                            status: order.status,
                            // 保留商品信息，防止商品删除后订单显示异常
                            productTitle: order.productTitle,
                            productPrice: order.productPrice,
                            productImage: order.productImage
                        };
                        records[index] = updatedOrder;
                        localStorage.setItem('purchaseRecords', JSON.stringify(records));
                        // 重新加载订单
                        this.loadSellerOrders();
                        // 显示成功消息
                        // 使用 Bootstrap Toast 显示成功提示
                        const toastHtml = `
                            <div class="toast align-items-center text-white bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
                                <div class="d-flex">
                                    <div class="toast-body">操作成功！</div>
                                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                                </div>
                            </div>
                        `;
                        // 将 Toast 插入到页面
                        const toastContainer = document.createElement('div');
                        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
                        toastContainer.innerHTML = toastHtml;
                        document.body.appendChild(toastContainer);
                        // 初始化并显示 Toast
                        const toast = new bootstrap.Toast(toastContainer.querySelector('.toast'));
                        toast.show();
                        // Toast 隐藏后移除 DOM
                        toastContainer.querySelector('.toast').addEventListener('hidden.bs.toast', () => {
                            toastContainer.remove();
                        });
                    }
                } catch (error) {
                    console.error('更新订单失败:', error);
                    alert('操作失败，请稍后重试');
                }
            }

            // 交易完成后删除对应商品
            if (isCompleted) {
                this.deleteProductAfterTrade(order.productId);
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
        deleteOrder(order) {
            if (confirm('确定要删除这笔订单吗？')) {
                try {
                    // 从localStorage中删除订单
                    const storedRecords = localStorage.getItem('purchaseRecords');
                    if (storedRecords) {
                        let records = JSON.parse(storedRecords);
                        // 过滤掉要删除的订单
                        const updatedRecords = records.filter(r => r.id !== order.id);
                        localStorage.setItem('purchaseRecords', JSON.stringify(updatedRecords));
                        // 重新加载订单
                        this.loadSellerOrders();
                        // 显示成功消息
                        alert('订单已删除');
                    }
                } catch (error) {
                    console.error('删除订单失败:', error);
                    alert('删除订单失败，请稍后重试');
                }
            }
        },
        cancelTrade(order) {
            if (confirm('确定要取消这笔交易吗？')) {
                try {
                    // 更新交易状态为取消
                    order.status = "交易取消";

                    // 更新localStorage中的数据
                    const storedRecords = localStorage.getItem('purchaseRecords');
                    if (storedRecords) {
                        let records = JSON.parse(storedRecords);
                        const index = records.findIndex(r => r.id === order.id);
                        if (index !== -1) {
                            // 只保存必要的字段回localStorage
                            const updatedOrder = {
                                id: order.id,
                                productId: order.productId,
                                buyerId: order.buyerId,
                                sellerId: order.sellerId,
                                buyerName: order.buyerName,
                                sellerName: order.sellerName,
                                purchaseTime: order.purchaseTime,
                                hasPaid: order.hasPaid,
                                hasShipped: order.hasShipped,
                                hasReceived: order.hasReceived,
                                status: order.status
                            };
                            records[index] = updatedOrder;
                            localStorage.setItem('purchaseRecords', JSON.stringify(records));
                            // 重新加载订单
                            this.loadSellerOrders();
                            // 关闭模态框
                            this.showProgressModal = false;
                            // 显示成功消息
                            alert('交易已取消');
                        }
                    }
                } catch (error) {
                    console.error('取消交易失败:', error);
                    alert('取消交易失败，请稍后重试');
                }
            }
        },
        getStatusClass(status) {
            switch (status) {
                case '待处理':
                case '进行中':
                case '待付款':
                case '未付款':
                    return 'bg-warning text-dark';
                case '已付款，待发货':
                case '已付款未发货':
                    return 'bg-info text-white';
                case '已发货':
                case '已发货，待收货':
                case '已发货未收到货':
                    return 'bg-primary text-white';
                case '已收货':
                    return 'bg-success text-white';
                case '已完成':
                case '交易完成':
                    return 'bg-success text-white';
                case '已取消':
                case '交易取消':
                    return 'bg-danger text-white';
                default:
                    return 'bg-secondary text-white';
            }
        },
        isSeller(order) {
            const storedUser = localStorage.getItem('userInfo');
            if (!storedUser) {
                return false;
            }
            const userInfo = JSON.parse(storedUser);
            return parseInt(userInfo.id) === order.sellerId;
        },
        formatDate(timestamp) {
            // 如果没有时间戳，返回默认值
            if (!timestamp) {
                return '未知';
            }
            const date = new Date(timestamp);
            return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        }
    }
};