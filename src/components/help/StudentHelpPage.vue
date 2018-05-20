<template>
  <div>
    <p class="section-title">基本流程</p>
    <p>参加考试 → Clone试卷 → 本地作答/测试 → Push试卷 → 查看在线测试结果 → 修改作答/本地测试 → Push试卷 → ……</p>
    <p class="section-title">参加考试</p>
    <p>在考试列表页面找到所要参加的考试，点击“参加考试”，在弹出的对话框中确认信息后点击“确定”，等待系统创建试卷完成即表明成功参加考试</p>
    <p class="section-title">Clone试卷</p>
    <p>在本地命令行/Git Bash中使用<code>git clone [试卷地址]</code>命令或使用IDE集成的Git插件将试卷clone到本地，注意试卷地址只会在考试开始后发放，在考试列表及考试详情页面均可查看</p>
    <p class="section-title">本地作答</p>
    <p>在本地使用任意IDE/编辑器对试卷进行作答，请务必在每次修改后进行保存；试卷中包含部分测试用例的题目可以使用JUnit进行本地测试，未包含测试用例的题目请构造main方法进行手工测试</p>
    <p class="section-title">Push试卷</p>
    <p>在本地命令行/Git Bash中使用以下命令或使用IDE集成的Git插件将试卷push到服务器</p>
    <pre><code>git add .
git commit -m "[该次提交的Commit Message]"
git push</code></pre>
    <p class="section-title">查看在线测试结果</p>
    <p>作答提交后将会被放入运行队列中依次运行测试，当测试完成后可以查看结果，测试结果可能有以下几种状态：</p>
    <p><el-tag type="info">等待运行</el-tag>表明该题正在运行队列中等待进行测试</p>
    <p><el-tag>正在运行</el-tag>表明该题正在进行测试</p>
    <p><el-tag type="success">所有用例通过</el-tag>表明该题的所有用例均通过测试或测试/变异覆盖率达到100%</p>
    <p><el-tag type="warning">有用例未通过</el-tag>表明该题的部分/所有用例没有通过测试或测试/变异覆盖率没有达到100%</p>
    <p><el-tag type="danger">编译或运行失败</el-tag>表明该题所提交的代码不能正常进行编译或运行</p>
    <p><el-tag type="danger">运行超时</el-tag>表明该题所提交的代码能正常进行编译或运行但进行测试时超过了时间限制</p>
    <p>对于“有用例未通过”状态，可以查看详情中各未通过用例的具体报错；对于“编译或运行失败”状态，可以查看详情中的控制台输出分析问题；对于“运行超时”状态，可以考虑死循环等代码问题</p>
    <p class="section-title">修改作答 & Then</p>
    <p>如果没有达到满分，则重复本地作答与Push试卷的过程</p>
    <p class="section-title">可能遇到的问题</p>
    <p class="sub-section-title">命令行中执行Clone和Push的时候明明密码正确但提示认证失败</p>
    <p>方法一：当出现Git Credential Manager要求输入账号密码的对话框时关闭该对话框并在命令行中输入用户名以及在随后的弹框中输入密码</p>
    <p>方法二：执行命令<code>git config --system --unset credential.helper</code></p>
    <p class="sub-section-title">使用Eclipse内置的Git插件进行Clone时提示Git地址不正确</p>
    <p>在试卷地址后增加<code>.git</code>后缀后作为Git地址</p>
    <p class="sub-section-title">运行<code>git commit</code>命令时提示没有可以提交的内容</p>
    <p>检查修改的文件是否已保存，检查导入到IDE中的项目的修改是否正确反映到原始文件中</p>
    <p class="sub-section-title">提交后显示“编译或运行失败”并且控制台输出中出现<code>\ufeff</code>字样</p>
    <p>使用Notepad++或其他工具将源代码中编码为<code>UTF8 BOM</code>的文件转换为<code>UTF-8</code>编码</p>
    <p class="section-title">FAQ</p>
    <p class="sub-section-title">考试中提交次数是否有限制？</p>
    <p>考试中不对提交次数进行任何限制，但恶意刷提交数量占用系统资源者后果自负</p>
    <p class="sub-section-title">如何界定考试临近结束时的提交是否有效？</p>
    <p>提交是否有效按照提交时间为准，只要考试结束前提交被系统记录则为有效，即结束前提交但排队到结束后运行测试的仍视为有效提交</p>
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
    <p class="sub-section-title">考试结束后想要继续研究题目时如何获取试题？</p>
    <p>考试结束后试卷地址仍有效，但只能进行clone而不能进行push</p>
  </div>
</template>

<script>
export default {
  name: 'StudentHelpPage'
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
