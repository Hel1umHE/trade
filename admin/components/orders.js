// 订单管理板块组件
const OrdersComponent = {
    template: `
        <div>
            <div class="mb-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5>订单列表</h5>
                    <div class="input-group" style="width: 300px;">
                        <input type="text" class="form-control" placeholder="搜索订单..." v-model="searchKeyword">
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
                                <button class="btn btn-sm btn-primary me-1" @click="editOrder(order)">
                                    <i class="bi bi-pencil"></i> 编辑
                                </button>
                                <select class="form-select form-select-sm" v-model="order.status" @change="updateOrderStatus(order)">
                                    <option value="待处理">待处理</option>
                                    <option value="进行中">进行中</option>
                                    <option value="已发货">已发货</option>
                                    <option value="已完成">已完成</option>
                                    <option value="已取消">已取消</option>
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
            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            // 确保所有订单都有必要的属性
            this.orders = orders.map(order => ({
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
            let orders = JSON.parse(localStorage.getItem('orders')) || [];
            orders = orders.map(o => {
                if (o.id === order.id) {
                    return { ...o, status: order.status };
                }
                return o;
            });
            localStorage.setItem('orders', JSON.stringify(orders));
            alert('订单状态已更新');
        },
        // 获取订单状态对应的CSS类
        getOrderStatusClass(status) {
            switch (status) {
                case '待处理':
                    return 'bg-warning text-dark';
                case '已发货':
                    return 'bg-primary';
                case '已完成':
                    return 'bg-success';
                case '已取消':
                    return 'bg-secondary';
                case '进行中':
                    return 'bg-info';
                default:
                    return 'bg-info';
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