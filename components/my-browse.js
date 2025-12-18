// 浏览记录页面组件
const MyBrowseComponent = {
    template: `
        <div>
            <h4>浏览记录</h4>
            <div class="mt-4">
                <!-- 当没有浏览记录时显示 -->
                <div v-if="browseRecords.length === 0">
                    <p>您还没有浏览记录</p>
                </div>
                <!-- 当有浏览记录时显示 -->
                <div v-else>
                    <div class="row">
                        <div class="col-md-4" v-for="record in browseRecords" :key="record.id">
                            <div class="product-card">
                                <img :src="record.productImage" alt="商品图片" @click="goToProductByBrowse(record)">
                                <div class="product-info">
                                    <h5 @click="goToProductByBrowse(record)" style="cursor: pointer;">{{ record.productTitle }}</h5>
                                    <p class="product-price">{{ record.productPrice }}</p>
                                    <div class="mt-2">
                                        <span>浏览时间：{{ formatDate(record.browseTime) }}</span>
                                    </div>
                                    <div class="mt-3">
                                        <button class="btn btn-sm btn-primary" @click="goToProductByBrowse(record)">查看详情</button>
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
            browseRecords: []
        };
    },
    mounted() {
        this.loadBrowseRecords();
    },
    methods: {
        loadBrowseRecords() {
            // 获取当前用户信息
            const storedUser = localStorage.getItem('userInfo');
            if (!storedUser) {
                return;
            }
            const userInfo = JSON.parse(storedUser);
            const currentUserId = parseInt(userInfo.id);

            // 从 localStorage 获取所有浏览记录
            const storedRecords = localStorage.getItem('browseRecords');
            if (storedRecords) {
                try {
                    const allRecords = JSON.parse(storedRecords);
                    // 筛选出当前用户的浏览记录，处理userId为null的情况
                    const userRecords = allRecords.filter(record => record.userId === currentUserId || record.userId === null);

                    // 获取所有商品数据
                    const storedProducts = localStorage.getItem('products');
                    const allProducts = storedProducts ? JSON.parse(storedProducts) : [];

                    // 为每条浏览记录补充完整商品信息
                    this.browseRecords = userRecords.map(record => {
                        const product = allProducts.find(p => p.id === record.productId) || {};
                        // 合并浏览记录和商品信息
                        return {
                            ...record,
                            productTitle: product.title || '未知商品',
                            productPrice: product.price || '¥0.00',
                            productImage: product.image || 'https://dummyimage.com/300x200/000/fff'
                        };
                    });
                } catch (error) {
                    console.error('加载浏览记录失败:', error);
                    this.browseRecords = [];
                }
            }
        },
        goToProductByBrowse(record) {
            // 根据商品ID获取商品详情
            const storedProducts = localStorage.getItem('products');
            if (storedProducts) {
                const allProducts = JSON.parse(storedProducts);
                const product = allProducts.find(p => p.id === record.productId);
                if (product) {
                    // 只保存商品ID到localStorage，避免localStorage容量超限
                    localStorage.setItem('currentProductId', product.id.toString());
                    this.$router.push(`/product/${product.id}`);
                }
            }
        },
        formatDate(timestamp) {
            // 如果没有时间戳，返回默认值
            if (!timestamp) {
                return '未知';
            }
            const date = new Date(timestamp);
            return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        }
    }
};