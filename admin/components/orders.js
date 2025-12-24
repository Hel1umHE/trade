// 订单管理板块组件
const OrdersComponent = {
    template: `
        <div>
            <div class="mb-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5>订单列表</h5>
                    <div class="input-group" style="width: 300px;">
                        <input type="text" class="form-control" placeholder="搜索订单..." v-model="searchKeyword" autocomplete="off">
                        <button class="btn btn-primary" @click="searchOrders">搜索</button>
                    </div>
                </div>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>订单ID</th>
                            <th>用户</th>
                            <th>商品</th>
                            <th>金额</th>
                            <th>状态</th>
                            <th>创建时间</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="order in filteredOrders" :key="order.id">
                            <td>{{ order.id }}</td>
                            <td>{{ order.user || '匿名用户' }}</td>
                            <td>{{ order.product || '未知商品' }}</td>
                            <td>{{ order.amount }}元</td>
                            <td>
                                <span class="badge" :class="getOrderStatusClass(order.status)">
                                    {{ order.status || '待处理' }}
                                </span>
                            </td>
                            <td>{{ formatDate(order.createdAt) }}</td>
                            <td>
                                <select class="form-select form-select-sm" v-model="order.status" @change="updateOrderStatus(order)">
                                    <option value="待付款">待付款</option>
                                    <option value="已付款未发货">已付款未发货</option>
                                    <option value="已发货未收到货">已发货未收到货</option>
                                    <option value="已收货">已收货</option>
                                    <option value="交易完成">交易完成</option>
                                    <!-- 保留已取消选项，处理已存在的取消状态订单 -->
                                    <option value="已取消" v-if="order.status === '已取消' || order.status === '交易取消'">已取消</option>
                                    <option value="交易取消" v-if="order.status === '已取消' || order.status === '交易取消'">交易取消</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <!-- 分页 -->
                <nav aria-label="Page navigation">
                    <ul class="pagination justify-content-center">
                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                            <button class="page-link" @click="currentPage--">上一页</button>
                        </li>
                        <li class="page-item" :class="{ active: currentPage === i }" v-for="i in totalPages" :key="i">
                            <button class="page-link" @click="currentPage = i">{{ i }}</button>
                        </li>
                        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                            <button class="page-link" @click="currentPage++">下一页</button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    `,
    data() {
        return {
            orders: [],
            searchKeyword: '',
            currentPage: 1,
            pageSize: 10
        };
    },
    computed: {
        // 过滤后的订单列表
        filteredOrders() {
            let result = this.orders;

            // 搜索过滤
            if (this.searchKeyword) {
                const keyword = this.searchKeyword.toLowerCase();
                result = result.filter(order =>
                    order.id.toString().includes(keyword) ||
                    (order.user && order.user.toLowerCase().includes(keyword)) ||
                    (order.product && order.product.toLowerCase().includes(keyword))
                );
            }

            // 分页
            const startIndex = (this.currentPage - 1) * this.pageSize;
            return result.slice(startIndex, startIndex + this.pageSize);
        },
        // 总页数
        totalPages() {
            return Math.ceil(this.orders.length / this.pageSize);
        }
    },
    mounted() {
        // 加载订单数据
        this.loadOrders();
    },
    methods: {
        // 加载订单数据
        loadOrders() {
            // 获取所有订单数据，包括正在进行的订单
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

            // 确保所有订单都有必要的属性
            this.orders = allOrders.map(order => ({
                id: order.id || Date.now() + Math.random(),
                user: order.user || '匿名用户',
                product: order.product || '未知商品',
                amount: order.amount || 0,
                status: order.status || '待处理',
                createdAt: order.createdAt || Date.now(),
                ...order
            }));
        },
        // 搜索订单
        searchOrders() {
            this.currentPage = 1;
        },
        // 编辑订单
        editOrder(order) {
            // 这里可以实现编辑订单的逻辑，例如打开编辑模态框
            alert(`编辑订单: #${order.id}`);
        },
        // 更新订单状态
        updateOrderStatus(order) {
            // 从localStorage中更新订单状态

            // 根据状态字符串设置对应的布尔状态字段
            const getOrderStatusFields = (status) => {
                let hasPaid = false;
                let hasShipped = false;
                let hasReceived = false;

                switch (status) {
                    case '待处理':
                    case '进行中':
                    case '待付款':
                    case '未付款':
                        hasPaid = false;
                        hasShipped = false;
                        hasReceived = false;
                        break;
                    case '已付款，待发货':
                    case '已付款未发货':
                        hasPaid = true;
                        hasShipped = false;
                        hasReceived = false;
                        break;
                    case '已发货':
                    case '已发货，待收货':
                    case '已发货未收到货':
                        hasPaid = true;
                        hasShipped = true;
                        hasReceived = false;
                        break;
                    case '已收货':
                        hasPaid = true;
                        hasShipped = true;
                        hasReceived = true;
                        break;
                    case '已完成':
                    case '交易完成':
                        hasPaid = true;
                        hasShipped = true;
                        hasReceived = true;
                        break;
                    case '已取消':
                    case '交易取消':
                        // 取消状态保持当前的布尔字段值
                        break;
                }

                return { hasPaid, hasShipped, hasReceived };
            };

            // 1. 更新传统orders数据源
            let orders = JSON.parse(localStorage.getItem('orders')) || [];
            let isOrderUpdated = false;

            orders = orders.map(o => {
                if (o.id === order.id) {
                    isOrderUpdated = true;
                    // 获取并设置对应的布尔状态字段
                    const statusFields = getOrderStatusFields(order.status);
                    return {
                        ...o,
                        status: order.status,
                        ...statusFields
                    };
                }
                return o;
            });
            localStorage.setItem('orders', JSON.stringify(orders));

            // 2. 如果传统orders中没有该订单，尝试更新purchaseRecords数据源
            if (!isOrderUpdated) {
                let purchaseRecords = JSON.parse(localStorage.getItem('purchaseRecords')) || [];

                purchaseRecords = purchaseRecords.map(record => {
                    if (record.id === order.id) {
                        // 获取并设置对应的布尔状态字段
                        const statusFields = getOrderStatusFields(order.status);
                        return {
                            ...record,
                            status: order.status,
                            ...statusFields
                        };
                    }
                    return record;
                });
                localStorage.setItem('purchaseRecords', JSON.stringify(purchaseRecords));
            }

            alert('订单状态已更新');
        },
        // 获取订单状态对应的CSS类
        getOrderStatusClass(status) {
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
        // 格式化日期
        formatDate(timestamp) {
            if (!timestamp) return '';
            const date = new Date(timestamp);
            return date.toLocaleString();
        }
    }
};