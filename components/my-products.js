// 我的商品页面组件
const MyProductsComponent = {
    template: `
        <div>
            <h4>我的商品</h4>
            <div class="mt-4">
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
                                    <div>
                                        <div class="mt-2">
                                            <span>发布时间：{{ formatDate(product.createdAt) }}</span>
                                        </div>
                                        <div class="mt-3 d-flex justify-content-between">
                                            <button class="btn btn-sm btn-primary" @click="goToProduct(product)">查看详情</button>
                                            <button class="btn btn-sm btn-danger" @click="deleteProduct(product)">删除商品</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            myProducts: []
        };
    },
    mounted() {
        this.loadMyProducts();
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
        goToProduct(product) {
            // 只保存商品ID到localStorage，避免localStorage容量超限
            localStorage.setItem('currentProductId', product.id.toString());
            // 跳转到商品详情页
            this.$router.push(`/product/${product.id}`);
        },
        formatDate(timestamp) {
            // 如果商品没有createdAt字段，返回默认值
            if (!timestamp) {
                return '未知';
            }
            const date = new Date(timestamp);
            return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        },
        deleteProduct(product) {
            // 弹出确认对话框
            if (confirm('确定要删除这个商品吗？')) {
                // 从localStorage获取所有商品
                const storedProducts = localStorage.getItem('products');
                if (storedProducts) {
                    let products = JSON.parse(storedProducts);
                    // 过滤掉要删除的商品
                    const updatedProducts = products.filter(p => p.id !== product.id);
                    // 保存更新后的商品列表
                    localStorage.setItem('products', JSON.stringify(updatedProducts));
                    // 重新加载商品列表
                    this.loadMyProducts();
                    // 显示成功消息
                    alert('商品已删除');
                }
            }
        }
    }
};