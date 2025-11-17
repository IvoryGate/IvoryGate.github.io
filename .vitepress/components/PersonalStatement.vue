<template>
  <div class="static-page">
    <header class="page-header">
      <h1>个人陈述</h1>
      <p>前端开发工程师 | 全栈技术爱好者</p>
    </header>

    <main class="content-wrapper">
      <section class="profile">
        <img src="../assets/avatar.png" alt="个人头像" class="avatar">
        <div class="bio">
          <h2>关于我</h2>
          <p>拥有3年前端开发经验，专注于现代Web应用架构和用户体验优化。熟悉TypeScript、Vue生态体系，擅长复杂项目的模块化开发。</p>
        </div>
      </section>

      <section class="experience">
        <h2>职业经历</h2>
        <article class="job">
          <h3>前端开发工程师 @ ABC科技</h3>
          <p>2021.03 - 至今</p>
          <ul>
            <li>主导公司核心产品的前端架构重构</li>
            <li>实现性能优化方案，首屏加载速度提升40%</li>
            <li>搭建组件库并制定团队开发规范</li>
          </ul>
        </article>

        <article class="job">
          <h3>前端工程师实习生 @ XYZ创新实验室</h3>
          <p>2020.06 - 2020.12</p>
          <ul>
            <li>参与教育类Web应用开发</li>
            <li>实现可视化数据看板组件</li>
            <li>优化代码质量获团队优秀实习生称号</li>
          </ul>
        </article>
      </section>

      <section class="skills">
        <h2>技术栈</h2>
        <div class="skill-list">
          <div class="skill-item">Vue.js</div>
          <div class="skill-item">TypeScript</div>
          <div class="skill-item">Node.js</div>
          <div class="skill-item">Webpack</div>
          <div class="skill-item">Ant Design</div>
        </div>
      </section>

      <section class="education">
        <h2>教育背景</h2>
        <article class="school">
          <h3>XX大学 计算机科学与技术</h3>
          <p>2016.09 - 2020.06</p>
          <ul>
            <li>GPA: 3.8/4.0</li>
            <li>校级优秀毕业生</li>
            <li>国家级奖学金获得者</li>
          </ul>
        </article>
      </section>

      <section class="contact">
        <h2>联系方式</h2>
        <div class="contact-info">
          <p>📧 邮箱：example@email.com</p>
          <p>📱 电话：+86 138-0000-0000</p>
          <p>🌐 GitHub：<a href="https://github.com/yourname" target="_blank">yourname</a></p>
        </div>
      </section>
    </main>

    <footer class="page-footer">
      <p>© 2025 个人陈述页面. 保留所有权利.</p>
    </footer>
  </div>
</template>

<style scoped>
.static-page {
  font-family: 'Segoe UI', system-ui, sans-serif;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  color: #333;
}

.page-header {
  text-align: center;
  padding-bottom: 2rem;
  border-bottom: 2px solid #eee;
  margin-bottom: 3rem;
}

.avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin: 0 auto 1rem;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.bio p {
  font-size: 1.1rem;
  color: #555;
  max-width: 600px;
  margin: 0 auto 2rem;
}

.content-wrapper {
  padding: 2rem 0;
}

section {
  margin-bottom: 3rem;
}

h2 {
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
}

.job {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.skill-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.skill-item {
  padding: 1rem;
  background: #ecf0f1;
  border-radius: 4px;
  text-align: center;
  font-weight: 500;
}

.contact-info {
  text-align: center;
}

.contact-info a {
  color: #3498db;
  text-decoration: none;
}

.contact-info a:hover {
  text-decoration: underline;
}

.page-footer {
  text-align: center;
  padding: 2rem 0;
  border-top: 1px solid #eee;
  margin-top: 3rem;
  color: #777;
}
</style>