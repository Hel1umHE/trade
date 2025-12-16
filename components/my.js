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
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">
                        <h6>我的商品</h6>
                    </div>
                    <div class="card-body">
                        <p>您还没有发布商品，<a href="#" @click="$parent.goToPublish">点击发布</a></p>
                    </div>
                </div>
            </div>
        </div>
    `
};