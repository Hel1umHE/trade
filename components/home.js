// 首页组件
const HomeComponent = {
    template: `
        <div>
            <h4>首页</h4>
            <p>欢迎来到校园交易平台首页！</p>
            <div class="row mt-4">
                <!-- 商品卡片示例 -->
                <div class="col-md-4">
                    <div class="product-card">
                        <img src="https://via.placeholder.com/300x200" alt="商品图片" @click="goToProduct(1)">
                        <div class="product-info">
                            <h5 @click="goToProduct(1)" style="cursor: pointer;">商品名称</h5>
                            <p class="text-muted">商品描述...</p>
                            <p class="product-price">¥99.00</p>
                            <div class="d-flex justify-content-between">
                                <span>发布者：用户名</span>
                                <button class="btn btn-sm btn-primary" @click="goToProduct(1)">查看详情</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="product-card">
                        <img src="https://via.placeholder.com/300x200" alt="商品图片" @click="goToProduct(2)">
                        <div class="product-info">
                            <h5 @click="goToProduct(2)" style="cursor: pointer;">商品名称</h5>
                            <p class="text-muted">商品描述...</p>
                            <p class="product-price">¥129.00</p>
                            <div class="d-flex justify-content-between">
                                <span>发布者：用户名</span>
                                <button class="btn btn-sm btn-primary" @click="goToProduct(2)">查看详情</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="product-card">
                        <img src="https://via.placeholder.com/300x200" alt="商品图片" @click="goToProduct(3)">
                        <div class="product-info">
                            <h5 @click="goToProduct(3)" style="cursor: pointer;">商品名称</h5>
                            <p class="text-muted">商品描述...</p>
                            <p class="product-price">¥159.00</p>
                            <div class="d-flex justify-content-between">
                                <span>发布者：用户名</span>
                                <button class="btn btn-sm btn-primary" @click="goToProduct(3)">查看详情</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    methods: {
        goToProduct(productId) {
            // 跳转到商品详情页
            this.$router.push(`/product/${productId}`);
        }
    }
};