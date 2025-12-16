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
                            <div class="product-card" @click="goToProduct(product.id)">
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
                nickname: '卖家昵称',
                registerTime: '2023-09-01',
                productCount: 3
            },
            sellerProducts: [
                {
                    id: 1,
                    title: '商品名称1',
                    description: '商品描述1...',
                    price: '¥99.00',
                    image: 'https://via.placeholder.com/300x200'
                },
                {
                    id: 2,
                    title: '商品名称2',
                    description: '商品描述2...',
                    price: '¥129.00',
                    image: 'https://via.placeholder.com/300x200'
                },
                {
                    id: 3,
                    title: '商品名称3',
                    description: '商品描述3...',
                    price: '¥159.00',
                    image: 'https://via.placeholder.com/300x200'
                }
            ]
        };
    },
    methods: {
        goToChat() {
            // 跳转到聊天界面
            this.$router.push('/chat');
        },
        goToProduct(productId) {
            // 跳转到商品详情页
            this.$router.push(`/product/${productId}`);
        }
    }
};