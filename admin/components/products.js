// 商品管理板块组件
const ProductsComponent = {
    template: `
        <div>
            <div class="mb-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5>商品列表</h5>
                    <div class="input-group" style="width: 300px;">
                        <input type="text" class="form-control" placeholder="搜索商品..." v-model="searchKeyword">
                        <button class="btn btn-primary" @click="searchProducts">搜索</button>
                    </div>
                </div>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>商品名称</th>
                            <th>价格</th>
                            <th>状态</th>
                            <th>创建时间</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="product in filteredProducts" :key="product.id">
                            <td>{{ product.id }}</td>
                            <td>{{ product.title }}</td>
                            <td>{{ product.price }}元</td>
                            <td>
                                <span class="badge" :class="product.status === '上架' ? 'bg-success' : 'bg-secondary'">
                                    {{ product.status || '上架' }}
                                </span>
                            </td>
                            <td>{{ formatDate(product.createdAt) }}</td>
                            <td>
                                <button class="btn btn-sm btn-danger" @click="deleteProduct(product.id)">
                                    <i class="bi bi-trash"></i> 删除
                                </button>
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
            products: [],
            searchKeyword: '',
            currentPage: 1,
            pageSize: 10
        };
    },
    computed: {
        // 过滤后的商品列表
        filteredProducts() {
            let result = this.products;
            
            // 搜索过滤
            if (this.searchKeyword) {
                const keyword = this.searchKeyword.toLowerCase();
                result = result.filter(product => 
                    product.title.toLowerCase().includes(keyword) ||
                    (product.description && product.description.toLowerCase().includes(keyword))
                );
            }
            
            // 分页
            const startIndex = (this.currentPage - 1) * this.pageSize;
            return result.slice(startIndex, startIndex + this.pageSize);
        },
        // 总页数
        totalPages() {
            return Math.ceil(this.products.length / this.pageSize);
        }
    },
    mounted() {
        // 加载商品数据
        this.loadProducts();
    },
    methods: {
        // 加载商品数据
        loadProducts() {
            const products = JSON.parse(localStorage.getItem('products')) || [];
            this.products = products;
        },
        // 搜索商品
        searchProducts() {
            this.currentPage = 1;
        },
        // 编辑商品
        editProduct(product) {
            // 这里可以实现编辑商品的逻辑，例如打开编辑模态框
            alert(`编辑商品: ${product.title}`);
        },
        // 删除商品
        deleteProduct(id) {
            if (confirm('确定要删除该商品吗？')) {
                // 从localStorage中删除商品
                let products = JSON.parse(localStorage.getItem('products')) || [];
                products = products.filter(product => product.id !== id);
                localStorage.setItem('products', JSON.stringify(products));
                // 重新加载商品列表
                this.loadProducts();
                alert('商品删除成功');
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