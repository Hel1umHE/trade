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
        // 从localStorage获取商品ID
        let productId = localStorage.getItem('currentProductId');

        // 如果localStorage中没有商品ID，尝试从URL参数中获取
        if (!productId) {
            const pathSegments = this.$route.path.split('/');
            productId = pathSegments[pathSegments.length - 1];
        }

        if (productId) {
            productId = parseInt(productId);
            // 从localStorage获取所有商品数据
            const storedProducts = localStorage.getItem('products');
            if (storedProducts) {
                const allProducts = JSON.parse(storedProducts);
                // 根据商品ID查找商品
                const foundProduct = allProducts.find(product => product.id === productId);
                if (foundProduct) {
                    this.product = foundProduct;
                    // 根据商品的sellerId获取卖家信息
                    this.getSellerInfo(this.product.sellerId);
                    // 添加浏览记录
                    this.addBrowseRecord();
                } else {
                    console.error('未找到对应的商品信息');
                }
            }
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
            try {
                // 获取当前用户信息
                const storedUser = localStorage.getItem('userInfo');
                if (!storedUser) {
                    alert('请先登录');
                    return;
                }
                const userInfo = JSON.parse(storedUser);

                // 创建购买记录，包含完整商品信息
                const purchaseRecord = {
                    id: Date.now() + Math.floor(Math.random() * 1000),
                    productId: this.product.id,
                    buyerId: parseInt(userInfo.id),
                    sellerId: parseInt(this.product.sellerId),
                    buyerName: userInfo.nickname,
                    sellerName: this.product.sellerName,
                    purchaseTime: Date.now(),
                    // 交易进度状态
                    hasPaid: false,       // 买家是否已付款
                    hasShipped: false,    // 卖家是否已发货
                    hasReceived: false,   // 买家是否已收货
                    status: "待付款",
                    // 保存完整商品信息，防止商品删除后订单显示异常
                    productTitle: this.product.title,
                    productPrice: this.product.price,
                    productImage: this.product.image
                };

                // 获取现有购买记录
                const storedRecords = localStorage.getItem('purchaseRecords');
                let records = [];
                if (storedRecords) {
                    try {
                        records = JSON.parse(storedRecords);
                    } catch (error) {
                        console.error('解析购买记录失败:', error);
                        records = [];
                    }
                }

                // 添加新记录
                records.push(purchaseRecord);

                // 限制购买记录数量，只保留最近的50条，减少localStorage占用
                if (records.length > 50) {
                    records = records.slice(-50);
                }

                // 保存回 localStorage
                localStorage.setItem('purchaseRecords', JSON.stringify(records));

                alert('购买请求已提交');
            } catch (error) {
                console.error('购买失败:', error);
                // 尝试清理部分数据
                try {
                    // 清空浏览记录以释放空间
                    localStorage.removeItem('browseRecords');
                    alert('购买失败，已清理部分数据，请重试');
                } catch (e) {
                    alert('购买失败，localStorage容量不足，请稍后重试');
                }
            }
        },
        addBrowseRecord() {
            // 获取当前用户信息
            let currentUserId = null;
            const storedUser = localStorage.getItem('userInfo');
            if (storedUser) {
                const userInfo = JSON.parse(storedUser);
                currentUserId = parseInt(userInfo.id);
            }

            // 简化浏览记录结构，只存储必要信息，减少localStorage占用
            const browseRecord = {
                id: Date.now() + Math.floor(Math.random() * 1000),
                userId: currentUserId,
                productId: this.product.id,
                browseTime: Date.now()
            };

            // 获取现有浏览记录
            const storedRecords = localStorage.getItem('browseRecords');
            let records = [];
            if (storedRecords) {
                try {
                    records = JSON.parse(storedRecords);
                } catch (error) {
                    console.error('解析浏览记录失败:', error);
                    records = [];
                }
            }

            // 移除相同商品的旧记录
            records = records.filter(record => record.productId !== this.product.id);

            // 添加新记录到开头
            records.unshift(browseRecord);

            // 进一步限制浏览记录数量为10条，减少存储占用
            if (records.length > 10) {
                records = records.slice(0, 10);
            }

            // 保存回 localStorage，添加错误处理
            try {
                localStorage.setItem('browseRecords', JSON.stringify(records));
            } catch (error) {
                console.error('保存浏览记录失败，localStorage容量可能不足:', error);
                // 如果保存失败，可以选择清空部分或全部浏览记录
                records = [];
                try {
                    localStorage.setItem('browseRecords', JSON.stringify(records));
                } catch (e) {
                    console.error('清空浏览记录失败:', e);
                }
            }
        }
    }
};