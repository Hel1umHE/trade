// 卖家主页组件
const SellerComponent = {
    template: `
        <div class="seller-page">
            <!-- 卖家基本信息 -->
            <div class="row mb-4">
                <div class="col-md-12">
                    <div class="d-flex align-items-center p-4" style="background-color: #f8f9fa; border-radius: 8px;">
                        <!-- 卖家头像 -->
                        <div class="avatar me-5" style="width: 100px; height: 100px; font-size: 40px;">
                            {{ seller.nickname.charAt(0) }}
                        </div>
                        
                        <!-- 卖家信息 -->
                        <div class="flex-grow-1">
                            <h2>{{ seller.nickname }}</h2>
                            <p class="text-muted mt-2">注册时间：{{ seller.registerTime }}</p>
                            <p class="text-muted">发布商品数：{{ seller.productCount }}</p>
                            <button class="btn btn-primary mt-3" @click="goToChat">与卖家私聊</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 卖家发布的商品 -->
            <div class="row">
                <div class="col-md-12">
                    <h3 class="mb-4">卖家发布的商品</h3>
                    
                    <div class="row">
                        <!-- 商品卡片 -->
                        <div class="col-md-4" v-for="product in sellerProducts" :key="product.id">
                            <div class="product-card" @click="goToProduct(product)">
                                <img :src="product.image" alt="商品图片">
                                <div class="product-info">
                                    <h5>{{ product.title }}</h5>
                                    <p class="text-muted">{{ product.description }}</p>
                                    <p class="product-price">{{ product.price }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 无商品提示 -->
                    <div v-if="sellerProducts.length === 0" class="text-center p-5" style="background-color: #e9ecef; border-radius: 8px;">
                        <p class="text-muted">该卖家尚未发布商品</p>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            seller: {
                id: 1,
                nickname: '未知卖家',
                registerTime: '未知',
                productCount: 0
            },
            sellerProducts: []
        };
    },
    mounted() {
        // 从路由参数获取卖家ID，确保是有效的数字
        const sellerId = parseInt(this.$route.params.id) || 0;
        // 获取卖家信息
        this.getSellerInfo(sellerId);
        // 获取卖家发布的商品
        this.getSellerProducts(sellerId);
    },
    methods: {
        getSellerInfo(sellerId) {
            // 确保sellerId是有效的数字
            if (isNaN(sellerId) || sellerId === 0) {
                this.seller = {
                    id: 0,
                    nickname: '未知卖家',
                    registerTime: '未知',
                    productCount: 0
                };
                return;
            }

            // 从 localStorage 获取当前用户信息
            const storedUser = localStorage.getItem('userInfo');
            if (storedUser) {
                const currentUser = JSON.parse(storedUser);
                // 确保ID类型一致
                const currentUserId = parseInt(currentUser.id);
                // 如果当前查看的卖家是当前用户，直接使用当前用户信息
                if (currentUserId === sellerId) {
                    this.seller = {
                        id: currentUserId,
                        nickname: currentUser.nickname,
                        registerTime: '2023-09-01', // 这里可以从用户信息中获取，假设用户信息中有注册时间
                        productCount: 0 // 这里会在获取商品后更新
                    };
                    return;
                }
            }

            // 从所有商品中获取卖家名称
            const storedProducts = localStorage.getItem('products');
            if (storedProducts) {
                const allProducts = JSON.parse(storedProducts);
                // 查找该卖家发布的任意一个商品，获取卖家名称
                // 确保ID类型一致
                const sellerProduct = allProducts.find(product => parseInt(product.sellerId) === sellerId);
                if (sellerProduct) {
                    this.seller = {
                        id: sellerId,
                        nickname: sellerProduct.sellerName,
                        registerTime: '未知',
                        productCount: 0 // 这里会在获取商品后更新
                    };
                } else {
                    // 如果没有找到匹配的商品，至少显示卖家ID
                    this.seller = {
                        id: sellerId,
                        nickname: `卖家${sellerId}`,
                        registerTime: '未知',
                        productCount: 0
                    };
                }
            }
        },
        getSellerProducts(sellerId) {
            // 确保sellerId是有效的数字
            if (isNaN(sellerId) || sellerId === 0) {
                this.sellerProducts = [];
                this.seller.productCount = 0;
                return;
            }

            // 从 localStorage 获取所有商品数据
            const storedProducts = localStorage.getItem('products');
            if (storedProducts) {
                const allProducts = JSON.parse(storedProducts);
                // 筛选出该卖家发布的商品，确保ID类型一致
                this.sellerProducts = allProducts.filter(product => parseInt(product.sellerId) === sellerId);
                // 更新卖家的商品数量
                this.seller.productCount = this.sellerProducts.length;
            } else {
                this.sellerProducts = [];
                this.seller.productCount = 0;
            }
        },
        goToChat() {
            // 跳转到聊天界面
            this.$router.push('/chat');
        },
        goToProduct(product) {
            // 只保存商品ID到localStorage，避免localStorage容量超限
            localStorage.setItem('currentProductId', product.id.toString());
            // 跳转到商品详情页
            this.$router.push(`/product/${product.id}`);
        }
    }
};