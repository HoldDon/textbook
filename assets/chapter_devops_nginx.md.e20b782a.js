import{_ as s,o as n,c as a,S as e}from"./chunks/framework.e9d044e1.js";const _=JSON.parse('{"title":"nginx","description":"","frontmatter":{},"headers":[],"relativePath":"chapter/devops/nginx.md","filePath":"chapter/devops/nginx.md"}'),l={name:"chapter/devops/nginx.md"},p=e(`<h1 id="nginx" tabindex="-1">nginx <a class="header-anchor" href="#nginx" aria-label="Permalink to &quot;nginx&quot;">​</a></h1><h2 id="多目录映射" tabindex="-1">多目录映射 <a class="header-anchor" href="#多目录映射" aria-label="Permalink to &quot;多目录映射&quot;">​</a></h2><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">server {</span></span>
<span class="line"><span style="color:#A6ACCD;">    listen       2233;</span></span>
<span class="line"><span style="color:#A6ACCD;">    server_name  localhost;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    location / {</span></span>
<span class="line"><span style="color:#A6ACCD;">        root   E:/document/dh-document/BladeX/vip/;</span></span>
<span class="line"><span style="color:#A6ACCD;">        index   index.html index.htm;</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">server {</span></span>
<span class="line"><span style="color:#A6ACCD;">    listen       3333;</span></span>
<span class="line"><span style="color:#A6ACCD;">    server_name  localhost;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    location / {</span></span>
<span class="line"><span style="color:#A6ACCD;">        root   E:/document/maicong/;</span></span>
<span class="line"><span style="color:#A6ACCD;">        index   index.html index.htm;</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span></code></pre></div>`,3),o=[p];function t(c,i,r,C,A,d){return n(),a("div",null,o)}const m=s(l,[["render",t]]);export{_ as __pageData,m as default};
