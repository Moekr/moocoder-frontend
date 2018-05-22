<template>
  <div>
    <p class="section-title">基本流程</p>
    <p>上传题目 → 创建考试 → 自行测试/等待开考 → 查看学生成绩/等待结束 → 下载成绩</p>
    <p class="section-title">上传试题</p>
    <p>上传合法的试题，试题名称只能包含大小写字母、数字、连词符和下划线，试题文件为zip格式无密码压缩包，至少应包含如下文件：</p>
    <pre><code>Java:
problem.zip
 ┣━src
 ┃  ┣━main
 ┃  ┃  ┗━java
 ┃  ┃     ┗━......(Java源文件)
 ┃  ┗━test
 ┃     ┗━java
 ┃        ┗━......(测试用例文件)
 ┗━pom.xml
Python:
problem.zip
 ┣━src
 ┃  ┗━......(Python源文件)
 ┣━test
 ┃  ┗━......(测试用例文件)
 ┗━requirements.txt</code></pre>
    <p>推荐包含README.md文件描述题目具体内容</p>
    <p class="section-title">创建考试</p>
    <p>首先在题目列表选择需要的题目，而后在创建考试页面选择起止时间创建考试，推荐单场考试题目不超过5个，考试创建后可能有以下状态</p>
    <p><el-tag type="info">准备中</el-tag>考试正在初始化中</p>
    <p><el-tag>尚未开始</el-tag>考试已经准备完成，正在等待开考</p>
    <p><el-tag type="success">正在进行</el-tag>考试正在进行中</p>
    <p><el-tag type="warning">已结束</el-tag>考试已经结束，正在等待完全关闭提交通道</p>
    <p><el-tag type="info">已关闭</el-tag>考试已经完全关闭，不允许任何提交</p>
    <p><el-tag type="danger">初始化失败</el-tag>考试在初始化过程中发生异常</p>
    <p class="section-title">自行测试</p>
    <p>考试初始化完毕后教师可以创建一份试卷进行测试，如果测试中发现问题可以删除考试重新创建</p>
    <p class="section-title">查看学生成绩</p>
    <p>考试中可以实时查看学生成绩及其分布情况，也可以查看学生的具体提交和测试情况，学生的测试结果可能包含如下情况</p>
    <p><el-tag type="info">等待运行</el-tag>表明该题正在运行队列中等待进行测试</p>
    <p><el-tag>正在运行</el-tag>表明该题正在进行测试</p>
    <p><el-tag type="success">所有用例通过</el-tag>表明该题的所有用例均通过测试或测试/变异覆盖率达到100%</p>
    <p><el-tag type="warning">有用例未通过</el-tag>表明该题的部分/所有用例没有通过测试或测试/变异覆盖率没有达到100%</p>
    <p><el-tag type="danger">编译或运行失败</el-tag>表明该题所提交的代码不能正常进行编译或运行</p>
    <p><el-tag type="danger">运行超时</el-tag>表明该题所提交的代码能正常进行编译或运行但进行测试时超过了时间限制</p>
    <p class="section-title">下载成绩</p>
    <p>考试结束后可以下载CSV格式的成绩清单</p>
    <p>对于“有用例未通过”状态，可以查看详情中各未通过用例的具体报错；对于“编译或运行失败”状态，可以查看详情中的控制台输出分析问题；对于“运行超时”状态，可以考虑死循环等代码问题</p>
    <p class="section-title">修改作答 & Then</p>
    <p>如果没有达到满分，则重复本地作答与Push试卷的过程</p>
    <p class="section-title">FAQ</p>
    <p class="sub-section-title">考试中服务端进行测试的环境？</p>
    <p>服务端进行测试的环境为Linux & OpenJDK/JRE8 & Python3.5，资源限制为单核 & 1GB内存，单次运行限制1分钟时长</p>
    <p class="sub-section-title">能否使用第三方库和依赖？</p>
    <p>除在试题中（Java为<code>pom.xml</code>中，Python为<code>requirements.txt</code>中）已经声明好的库和依赖外，不允许使用任何其他库和依赖</p>
    <p class="sub-section-title">试卷中的那些文件可以修改？</p>
    <p>默认情况下只允许修改源代码文件（普通题目）或测试代码文件（测试覆盖率题目或变异覆盖题目）</p>
    <p class="sub-section-title">含有多道题的考试中一次提交会运行哪些题目？</p>
    <p>系统会检测该次提交和上次提交之间的修改，并运行所有修改过的题目，如果没有检测到有对题目的修改（例如只修改了试卷根目录下的内容）则会运行所有题目</p>
    <p class="sub-section-title">一场考试、一次提交以及对一道题目的测试的分数是如何计算的？</p>
    <p>一场考试的分数由分数最高的提交决定</p>
    <p>一次提交的分数由所有题目的平均分决定，其中该次提交运行过的题目取该次提交的分数，该次提交没有运行过的题目取上次运行的分数（非历史最高分数），从未运行过的题目取0分</p>
    <p>一道题目的测试分数为通过用例数在所有用例中的比例（普通题目）或测试覆盖率（测试覆盖率题目）或变异覆盖率（变异覆盖题目）</p>
    <p>以上满分均为100分，所有计算采用向下取整策略</p>
  </div>
</template>

<script>
export default {
  name: 'TeacherHelpPage'
}
</script>

<style scoped>
  .section-title {
    margin-left: 0;
    font-size: 18px;
    font-weight: bolder;
  }
  .sub-section-title {
    margin-left: 6px;
    font-size: 15px;
    font-weight: bolder;
  }
  p, pre {
    margin-left: 12px;
  }
  .section-title:first-child {
    margin-top: 0;
  }
  .el-tag {
    margin-right: 6px;
  }
  code {
    font-family: Monaco, Menlo, Consolas, "Courier New", monospace;
    margin: 0 2px;
    padding: 2px 2px;
    font-size: 90%;
    color: #c7254e;
    background-color: #f9f2f4;
    border: 1px solid #fcc;
    border-radius: 0.4em;
  }
  pre code {
    overflow: auto;
    display: block;
    padding: 10px;
    line-height: 1.428571429;
    color: #333;
    word-break: break-all;
    word-wrap: break-word;
    background-color: #e5e5e5;
    border: 1px solid #ccc;
    border-radius: 0.5em;
    white-space: pre;
  }
</style>
