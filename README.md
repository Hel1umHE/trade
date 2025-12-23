# 校园二手闲置交易平台
由本人编写的闲置交易平台，为课上作业  
*项目使用TRAE SOLO辅助编写

## 技术栈
- 前端：Vue.js、Bootstrap、JavaScript

## 技术细节
- 前端采用Vue.js框架，使用Bootstrap框架进行页面布局和样式设计
- 前端页面均采用单页应用（SPA）架构，通过Vue.js的路由组件实现页面之间的切换

## 文件夹大致结构及各文件用途
- `account`文件夹: 账号相关文件
    - `login.html`：登录页面
    - `register.html`：注册页面
    - `verify.html`：验证页面
- `admin`文件夹: 管理后台相关文件
    - `login.html`：管理后台登录页面
    - `index.html`：管理后台入口文件
    - `components`文件夹: 管理后台各部分组件
      - `dashboard.js`：管理后台首页
      - `orders.js`：订单管理
      - `products.js`：商品管理
      - `users.js`：用户管理
- `components`文件夹: 各部分组件
    - `about.js`：关于
    - `change-password.js`：修改密码
    - `chat.js`：聊天
    - `edit-profile.js`：编辑个人信息
    - `home.js`：首页
    - `my-browse.js`：用户浏览过的商品
    - `my-products.js`：用户发布的商品
    - `my-purchase.js`：用户的购买记录
    - `my.js`：用户个人主页
    - `product.js`：商品详情
    - `publish.js`：发布商品
    - `seller-orders.js`：卖家订单管理
    - `seller.js`：卖家个人主页
- `res`文件夹: 资源文件夹
  - `bootstrap-5.3.8-dist`文件夹: Bootstrap框架
  - `vue.js`文件: Vue.js框架
  - `vue-router.js`文件: Vue.js路由组件
- `index.html`: 项目入口文件
- `README.md`: 项目说明文档
- `admin.txt`: 管理后台账号密码

## 下载项目
```bash
git clone git@gitcode.com:Hel1um_HE/trade_platform.git
```
或者   
右上角“下载Zip”之后解压
## 运行项目
在clone本仓库之后，双击打开项目文件夹，找到`index.html`文件，用浏览器打开即可。

## 已知问题
1. 私聊相关逻辑未编写 
2. 商品在交易完成以后，在卖家订单处商品名会显示为“未知商品”，同时商品图片会丢失
3. 通过管理后台修改订单状态后的订单，用户个人主页的“我的购买”和“我的发布”中对应订单状态颜色会被覆盖为灰色
4. 特殊情况下，用户发布的商品可能不会显示在用户个人主页的“我的发布”中
5. 无法设置头像