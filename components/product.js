// 商品详情组件
const ProductComponent = {
    template: `
        <div class="product-detail">
            <div class="row mb-4">
                <!-- 商品图片 -->
                <div class="col-md-6">
                    <img :src="product.image" alt="商品图片" class="img-fluid" style="width: 100%; height: auto; border-radius: 8px;">
                </div>
                
                <!-- 商品信息 -->
                <div class="col-md-6">
                    <h2>{{ product.title }}</h2>
                    <h3 class="text-danger mt-3">{{ product.price }}</h3>
                    
                    <!-- 简介 -->
                    <div class="mt-4" style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
                        <h4 class="mb-3">简介</h4>
                        <p>{{ product.description }}</p>
                    </div>
                    
                    <!-- 操作按钮 -->
                    <div class="mt-4">
                        <button class="btn btn-primary me-3" @click="goToChat">与卖家私聊</button>
                    </div>
                </div>
            </div>
            
            <!-- 卖家信息 -->
            <div class="row mt-4">
                <div class="col-md-12">
                    <div class="d-flex align-items-center" style="background-color: #e9ecef; padding: 15px; border-radius: 8px;">
                        <!-- 卖家头像 -->
                        <div class="avatar me-4" style="cursor: pointer;" @click="goToSellerPage">
                            {{ seller.nickname.charAt(0) }}
                        </div>
                        
                        <!-- 卖家信息 -->
                        <div class="flex-grow-1">
                            <h5>{{ seller.nickname }}</h5>
                            <button class="btn btn-outline-primary btn-sm" @click="goToSellerPage">查看个人主页</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            product: {
                id: 1,
                title: '月饼礼盒',
                price: '¥199.00',
                image: 'https://via.placeholder.com/600x400',
                description: '精美的月饼礼盒，包含多种口味，适合节日送礼和家庭享用。采用优质食材制作，口感细腻，包装精美。'
            },
            seller: {
                id: 1,
                nickname: '卖家昵称',
                avatar: '头'
            }
        };
    },
    methods: {
        goToChat() {
            // 跳转到聊天界面
            this.$router.push('/chat');
        },
        goToSellerPage() {
            // 跳转到卖家个人主页
            this.$router.push(`/seller/${this.seller.id}`);
        }
    }
};