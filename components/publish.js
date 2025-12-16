// 发布商品组件
const PublishComponent = {
    template: `
        <div>
            <h4>发布商品</h4>
            <form class="mt-4" @submit.prevent="publishProduct">
                <div class="mb-3">
                    <label for="productName" class="form-label">商品名称</label>
                    <input type="text" class="form-control" id="productName" v-model="product.title" placeholder="请输入商品名称" required>
                </div>
                <div class="mb-3">
                    <label for="productPrice" class="form-label">商品价格</label>
                    <input type="number" class="form-control" id="productPrice" v-model.number="product.price" placeholder="请输入商品价格" required step="0.01">
                </div>
                <div class="mb-3">
                    <label for="productDescription" class="form-label">商品描述</label>
                    <textarea class="form-control" id="productDescription" v-model="product.description" rows="3" placeholder="请输入商品描述" required></textarea>
                </div>
                <div class="mb-3">
                    <label for="productImage" class="form-label">商品图片</label>
                    <input type="file" class="form-control" id="productImage" accept="image/*" @change="handleImageUpload" required>
                    <div class="mt-2" v-if="product.image">
                        <img :src="product.image" alt="商品预览" class="img-thumbnail" style="max-width: 200px;">
                    </div>
                </div>
                <button type="submit" class="btn btn-primary">发布商品</button>
                <button type="button" class="btn btn-secondary ms-2" @click="$router.push('/home')">取消</button>
            </form>
        </div>
    `,
    data() {
        return {
            product: {
                title: '',
                price: '',
                description: '',
                image: ''
            }
        };
    },
    methods: {
        handleImageUpload(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.product.image = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        },
        publishProduct() {
            try {
                // 验证表单数据
                if (!this.product.title || !this.product.price || !this.product.description || !this.product.image) {
                    alert('请填写完整的商品信息');
                    return;
                }

                // 获取当前用户信息
                const storedUser = localStorage.getItem('userInfo');
                if (!storedUser) {
                    alert('请先登录');
                    this.$router.push('/login');
                    return;
                }
                const userInfo = JSON.parse(storedUser);

                // 生成唯一商品 ID
                const productId = Date.now() + Math.floor(Math.random() * 1000);

                // 格式化价格
                const formattedPrice = `¥${parseFloat(this.product.price).toFixed(2)}`;

                // 构建商品对象
                const newProduct = {
                    id: productId,
                    title: this.product.title,
                    price: formattedPrice,
                    description: this.product.description,
                    image: this.product.image,
                    sellerId: parseInt(userInfo.id),
                    sellerName: userInfo.nickname,
                    createdAt: Date.now()
                };

                // 从 localStorage 获取现有商品数据
                const storedProducts = localStorage.getItem('products');
                let products = [];
                if (storedProducts) {
                    products = JSON.parse(storedProducts);
                }

                // 添加新商品
                products.push(newProduct);

                // 保存到 localStorage
                localStorage.setItem('products', JSON.stringify(products));

                // 显示成功提示
                alert('商品发布成功！');

                // 跳转到首页
                this.$router.push('/home');
            } catch (error) {
                console.error('发布商品失败:', error);
                alert('商品发布失败，请重试');
            }
        }
    }
};