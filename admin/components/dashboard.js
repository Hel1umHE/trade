// 总览板块组件
const DashboardComponent = {
    template: `
        <div>
            <div class="row mb-3">
                <div class="col-md-4">
                    <div class="card bg-primary text-white">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 class="card-title">商品总数</h5>
                                    <p class="card-text display-4">{{ stats.products }}</p>
                                </div>
                                <i class="bi bi-box-fill" style="font-size: 3rem;"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card bg-success text-white">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 class="card-title">用户总数</h5>
                                    <p class="card-text display-4">{{ stats.users }}</p>
                                </div>
                                <i class="bi bi-people-fill" style="font-size: 3rem;"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card bg-warning text-white">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 class="card-title">订单总数</h5>
                                    <p class="card-text display-4">{{ stats.orders }}</p>
                                </div>
                                <i class="bi bi-list-ul" style="font-size: 3rem;"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title mb-0">最新商品</h5>
                        </div>
                        <div class="card-body">
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item d-flex justify-content-between align-items-center" v-for="product in latestProducts" :key="product.id">
                                    <div>
                                        <h6 class="mb-1">{{ product.title }}</h6>
                                        <small class="text-muted">{{ product.price }}元</small>
                                    </div>
                                    <span class="badge bg-primary">{{ product.status || '上架' }}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title mb-0">最新订单</h5>
                        </div>
                        <div class="card-body">
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item d-flex justify-content-between align-items-center" v-for="order in latestOrders" :key="order.id">
                                    <div>
                                        <h6 class="mb-1">订单 #{{ order.id }}</h6>
                                        <small class="text-muted">{{ order.user || '匿名用户' }} - {{ order.amount }}元</small>
                                    </div>
                                    <span class="badge bg-success">{{ order.status || '待处理' }}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            stats: {
                products: 0,
                users: 0,
                orders: 0,
                browses: 0
            },
            latestProducts: [],
            latestOrders: []
        };
    },
    mounted() {
        // 初始化数据
        this.loadStats();
        this.loadLatestProducts();
        this.loadLatestOrders();
    },
    methods: {
        // 加载统计数据
        loadStats() {
            // 从localStorage获取数据
            const products = JSON.parse(localStorage.getItem('products')) || [];
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            const purchaseRecords = JSON.parse(localStorage.getItem('purchaseRecords')) || [];
            const browses = JSON.parse(localStorage.getItem('browses')) || [];

            // 计算统计数据
            this.stats.products = products.length;
            this.stats.users = users.length;
            // 订单总数 = 传统订单数 + 用户购买记录数
            this.stats.orders = orders.length + purchaseRecords.length;
            this.stats.browses = browses.length;
        },
        // 加载最新商品
        loadLatestProducts() {
            const products = JSON.parse(localStorage.getItem('products')) || [];
            // 按创建时间排序，取前5个
            this.latestProducts = products
                .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
                .slice(0, 5);
        },
        // 加载最新订单
        loadLatestOrders() {
            let allOrders = [];
            
            // 1. 从传统orders键获取订单
            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            allOrders = [...orders];
            
            // 2. 从purchaseRecords键获取正在进行的用户订单
            const purchaseRecords = JSON.parse(localStorage.getItem('purchaseRecords')) || [];
            
            // 转换purchaseRecords为统一的订单格式
            const userOrders = purchaseRecords.map(record => {
                // 获取商品信息
                const products = JSON.parse(localStorage.getItem('products')) || [];
                const product = products.find(p => p.id === record.productId) || {};
                
                return {
                    id: record.id,
                    user: record.buyerName || '匿名用户',
                    product: product.title || '未知商品',
                    amount: product.price || 0,
                    status: record.status || '待处理',
                    createdAt: record.purchaseTime || Date.now(),
                    buyerId: record.buyerId,
                    sellerId: record.sellerId,
                    hasPaid: record.hasPaid,
                    hasShipped: record.hasShipped,
                    hasReceived: record.hasReceived
                };
            });
            
            // 合并所有订单
            allOrders = [...allOrders, ...userOrders];
            
            // 按创建时间排序，取前5个
            this.latestOrders = allOrders
                .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
                .slice(0, 5);
        }
    }
};