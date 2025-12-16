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
                        <button class="btn btn-success" @click="buyProduct">立即购买</button>
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
                title: '',
                price: '',
                image: '',
                description: '',
                sellerId: 1,
                sellerName: ''
            },
            seller: {
                id: 1,
                nickname: '',
                registerTime: '',
                productCount: 0
            }
        };
    },
    mounted() {
        // 从localStorage获取当前商品信息
        const storedProduct = localStorage.getItem('currentProduct');
        if (storedProduct) {
            this.product = JSON.parse(storedProduct);
            // 根据商品的sellerId获取卖家信息
            this.getSellerInfo(this.product.sellerId);
            // 添加浏览记录
            this.addBrowseRecord();
        }
    },
    methods: {
        getSellerInfo(sellerId) {
            // 从 localStorage 获取当前用户信息
            const storedUser = localStorage.getItem('userInfo');
            if (storedUser) {
                const currentUser = JSON.parse(storedUser);
                // 确保ID类型一致
                const currentUserId = parseInt(currentUser.id);
                sellerId = parseInt(sellerId);
                // 如果当前商品的卖家是当前用户，直接使用当前用户信息
                if (currentUserId === sellerId) {
                    this.seller = {
                        id: currentUserId,
                        nickname: currentUser.nickname,
                        registerTime: '2023-09-01', // 这里可以从用户信息中获取，假设用户信息中有注册时间
                        productCount: 0 // 这里可以计算用户发布的商品数量
                    };
                    return;
                }
            }

            // 从商品信息中获取卖家名称（作为备用）
            this.seller = {
                id: sellerId,
                nickname: this.product.sellerName || `卖家${sellerId}`,
                registerTime: '未知',
                productCount: 0
            };
        },
        goToChat() {
            // 跳转到聊天界面
            this.$router.push('/chat');
        },
        goToSellerPage() {
            // 确保卖家ID是有效的数字
            const sellerId = this.seller.id || 0;
            if (sellerId !== 0) {
                // 跳转到卖家个人主页
                this.$router.push(`/seller/${sellerId}`);
            } else {
                alert('无法查看该卖家的个人主页');
            }
        },
        buyProduct() {
            // 获取当前用户信息
            const storedUser = localStorage.getItem('userInfo');
            if (!storedUser) {
                alert('请先登录');
                return;
            }
            const userInfo = JSON.parse(storedUser);

            // 创建购买记录
            const purchaseRecord = {
                id: Date.now() + Math.floor(Math.random() * 1000),
                productId: this.product.id,
                productTitle: this.product.title,
                productPrice: this.product.price,
                productImage: this.product.image,
                buyerId: parseInt(userInfo.id),
                sellerId: parseInt(this.product.sellerId),
                buyerName: userInfo.nickname,
                sellerName: this.product.sellerName,
                purchaseTime: Date.now(),
                // 交易进度状态
                hasPaid: false,       // 买家是否已付款
                hasShipped: false,    // 卖家是否已发货
                hasReceived: false,   // 买家是否已收货
                status: "待付款"
            };

            // 获取现有购买记录
            const storedRecords = localStorage.getItem('purchaseRecords');
            let records = [];
            if (storedRecords) {
                records = JSON.parse(storedRecords);
            }

            // 添加新记录
            records.push(purchaseRecord);

            // 保存回 localStorage
            localStorage.setItem('purchaseRecords', JSON.stringify(records));

            alert('购买请求已提交');
        },
        addBrowseRecord() {
            // 获取当前用户信息
            let currentUserId = null;
            const storedUser = localStorage.getItem('userInfo');
            if (storedUser) {
                const userInfo = JSON.parse(storedUser);
                currentUserId = parseInt(userInfo.id);
            }

            // 创建浏览记录
            const browseRecord = {
                id: Date.now() + Math.floor(Math.random() * 1000),
                userId: currentUserId,
                productId: this.product.id,
                productTitle: this.product.title,
                productPrice: this.product.price,
                productImage: this.product.image,
                sellerId: parseInt(this.product.sellerId),
                sellerName: this.product.sellerName,
                browseTime: Date.now()
            };

            // 获取现有浏览记录
            const storedRecords = localStorage.getItem('browseRecords');
            let records = [];
            if (storedRecords) {
                records = JSON.parse(storedRecords);
            }

            // 移除相同商品的旧记录
            records = records.filter(record => record.productId !== this.product.id);

            // 添加新记录到开头
            records.unshift(browseRecord);

            // 限制浏览记录数量为20条
            if (records.length > 20) {
                records = records.slice(0, 20);
            }

            // 保存回 localStorage
            localStorage.setItem('browseRecords', JSON.stringify(records));
        }
    }
};