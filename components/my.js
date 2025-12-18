// 个人中心组件
const MyComponent = {
    template: `
        <div>
        <h4>我的</h4>
        <div class="mt-4">
            <div class="card mb-4">
                <div class="card-header">
                    <h6>个人信息</h6>
                </div>
                <div class="card-body">
                    <p><strong>昵称：</strong> {{ $parent.userInfo.nickname }}</p>
                    <p><strong>手机号：</strong> {{ $parent.userInfo.phone }}</p>
                    <p><strong>真实姓名：</strong> {{ $parent.userInfo.realName }}</p>
                    <p><strong>班级：</strong> {{ $parent.userInfo.className }}</p>
                    <p><strong>学号：</strong> {{ $parent.userInfo.studentID }}</p>
                    <div class="mt-3">
                        <button class="btn btn-primary" @click="goToEditProfile">修改个人信息</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 退出登录与注销 -->
            <div class="card mb-4 mt-4">
                <div class="card-header">
                    <h6>账户管理</h6>
                </div>
                <div class="card-body">
                    <div class="d-flex gap-3">
                        <button class="btn btn-primary" @click="goToChangePassword">修改密码</button>
                        <button class="btn btn-warning" @click="logout">退出登录</button>
                        <button class="btn btn-danger" @click="deleteAccount">注销账号</button>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
        };
    },
    mounted() {
    },
    methods: {
        logout() {
            // 弹出确认对话框
            if (confirm('确定要退出登录吗？')) {
                // 清除用户信息
                localStorage.removeItem('userInfo');
                // 跳转到登录页面
                window.location.href = 'account/login.html';
            }
        },
        deleteAccount() {
            // 弹出确认对话框，二次确认
            if (confirm('确定要注销账号吗？此操作不可恢复！')) {
                if (confirm('再次确认要注销账号吗？所有数据将被永久删除！')) {
                    // 获取当前用户ID和手机号
                    const currentUserId = parseInt(this.$parent.userInfo.id);
                    const currentUserPhone = this.$parent.userInfo.phone;

                    // 清除当前用户信息
                    localStorage.removeItem('userInfo');
                    localStorage.removeItem('currentUser');

                    // 从用户列表中删除当前用户
                    const users = JSON.parse(localStorage.getItem('users')) || [];
                    const updatedUsers = users.filter(user => user.id !== currentUserId);
                    localStorage.setItem('users', JSON.stringify(updatedUsers));

                    // 删除用户发布的商品
                    const storedProducts = localStorage.getItem('products');
                    if (storedProducts) {
                        let products = JSON.parse(storedProducts);
                        const updatedProducts = products.filter(p => parseInt(p.sellerId) !== currentUserId);
                        localStorage.setItem('products', JSON.stringify(updatedProducts));
                    }

                    // 删除用户相关的购买记录
                    const storedPurchaseRecords = localStorage.getItem('purchaseRecords');
                    if (storedPurchaseRecords) {
                        let records = JSON.parse(storedPurchaseRecords);
                        const updatedRecords = records.filter(r => parseInt(r.buyerId) !== currentUserId && parseInt(r.sellerId) !== currentUserId);
                        localStorage.setItem('purchaseRecords', JSON.stringify(updatedRecords));
                    }

                    // 跳转到登录页面
                    alert('账号已成功注销');
                    window.location.href = 'account/login.html';
                }
            }
        },
        goToChangePassword() {
            // 跳转到修改密码页面
            this.$router.push('/change-password');
        },
        goToEditProfile() {
            // 跳转到修改个人信息页面
            this.$router.push('/edit-profile');
        }
    }
};