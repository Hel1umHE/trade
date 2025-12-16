// 发布商品组件
const PublishComponent = {
    template: `
        <div>
            <h4>发布商品</h4>
            <form class="mt-4">
                <div class="mb-3">
                    <label for="productName" class="form-label">商品名称</label>
                    <input type="text" class="form-control" id="productName" placeholder="请输入商品名称" required>
                </div>
                <div class="mb-3">
                    <label for="productPrice" class="form-label">商品价格</label>
                    <input type="number" class="form-control" id="productPrice" placeholder="请输入商品价格" required step="0.01">
                </div>
                <div class="mb-3">
                    <label for="productDescription" class="form-label">商品描述</label>
                    <textarea class="form-control" id="productDescription" rows="3" placeholder="请输入商品描述" required></textarea>
                </div>
                <div class="mb-3">
                    <label for="productImage" class="form-label">商品图片</label>
                    <input type="file" class="form-control" id="productImage" accept="image/*" required>
                </div>
                <button type="submit" class="btn btn-primary">发布商品</button>
                <button type="button" class="btn btn-secondary ms-2" @click="$router.push('/home')">取消</button>
            </form>
        </div>
    `
};