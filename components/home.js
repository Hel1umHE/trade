// 首页组件
const HomeComponent = {
    template: `
        <div>
            <h4>首页</h4>
            <p>欢迎来到校园交易平台首页！</p>
            <div class="row mt-4">
                <!-- 商品卡片 -->
                <div class="col-md-4" v-for="product in products" :key="product.id">
                    <div class="product-card">
                        <img :src="product.image" alt="商品图片" @click="goToProduct(product)">
                        <div class="product-info">
                            <h5 @click="goToProduct(product)" style="cursor: pointer;">{{ product.title }}</h5>
                            <p class="text-muted">{{ product.description }}</p>
                            <p class="product-price">{{ product.price }}</p>
                            <div class="d-flex justify-content-between">
                                <span>发布者：{{ product.sellerName }}</span>
                                <button class="btn btn-sm btn-primary" @click="goToProduct(product)">查看详情</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            products: []
        };
    },
    mounted() {
        this.loadProducts();
    },
    methods: {
        loadProducts() {
            // 从 localStorage 获取商品数据
            const storedProducts = localStorage.getItem('products');
            if (storedProducts) {
                this.products = JSON.parse(storedProducts);
            } else {
                // 初始化示例商品数据
                const initialProducts = [
                    {
                        id: 1,
                        title: '磁轴键盘',
                        description: '磁轴键盘，泰山轴GT，高精准度助你停的更稳',
                        price: '¥99.00',
                        image: 'https://dummyimage.com/300x200/000/fff',
                        sellerId: 1,
                        sellerName: '卖家昵称1'
                    },
                    {
                        id: 2,
                        title: '游戏鼠标',
                        description: '高精度游戏鼠标，RGB灯光，舒适握感',
                        price: '¥129.00',
                        image: 'https://dummyimage.com/300x200/000/fff',
                        sellerId: 2,
                        sellerName: '卖家昵称2'
                    },
                    {
                        id: 3,
                        title: '机械键盘',
                        description: '青轴机械键盘，打字手感舒适，RGB背光',
                        price: '¥159.00',
                        image: 'https://dummyimage.com/300x200/000/fff',
                        sellerId: 1,
                        sellerName: '卖家昵称1'
                    }
                ];
                // 保存到 localStorage
                localStorage.setItem('products', JSON.stringify(initialProducts));
                this.products = initialProducts;
            }
        },
        goToProduct(product) {
            // 保存当前商品信息到localStorage
            localStorage.setItem('currentProduct', JSON.stringify(product));
            // 跳转到商品详情页
            this.$router.push(`/product/${product.id}`);
        }
    }
};