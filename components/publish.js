// 发布商品组件
const PublishComponent = {
    template: `
        <div>
            <h4>发布商品</h4>
            <form class="mt-4" @submit.prevent="publishProduct">
                <div class="mb-3">
                    <label for="productName" class="form-label">商品名称</label>
                    <input type="text" class="form-control" id="productName" v-model="product.title" placeholder="请输入商品名称" autocomplete="off" required>
                </div>
                <div class="mb-3">
                    <label for="productPrice" class="form-label">商品价格</label>
                    <input type="number" class="form-control" id="productPrice" v-model.number="product.price" placeholder="请输入商品价格" autocomplete="off" required step="0.01">
                </div>
                <div class="mb-3">
                    <label for="productDescription" class="form-label">商品描述</label>
                    <textarea class="form-control" id="productDescription" v-model="product.description" rows="3" placeholder="请输入商品描述" autocomplete="off" required></textarea>
                </div>
                <div class="mb-3">
                    <label for="productImage" class="form-label">商品图片</label>
                    <input type="file" class="form-control" id="productImage" accept="image/*" @change="handleImageUpload" required>
                    <div class="form-text">请上传商品图片（最大文件大小为3MB）</div>
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
                // 使用 Bootstrap Toast 显示成功提示
                const toastHtml = `
                    <div class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="2000">
                        <div class="toast-header">
                            <strong class="me-auto">提示</strong>
                            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="关闭"></button>
                        </div>
                        <div class="toast-body">商品发布成功！</div>
                    </div>
                `;
                // 将 Toast 插入页面
                const toastContainer = document.createElement('div');
                toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
                toastContainer.innerHTML = toastHtml;
                document.body.appendChild(toastContainer);
                // 初始化并显示 Toast
                const toast = new bootstrap.Toast(toastContainer.querySelector('.toast'));
                toast.show();

                // 跳转到首页
                this.$router.push('/home');
            } catch (error) {
                console.error('发布商品失败:', error);
                alert('商品发布失败，请重试');
            }
        }
    }
};