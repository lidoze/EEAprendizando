const LANGS = {
    html:  { name: 'HTML',       color: '#e44d26', desc: 'A estrutura de qualquer página web: títulos, textos, links, listas e formulários.' },
    css:   { name: 'CSS',        color: '#2965f1', desc: 'Cores, espaçamentos, layouts e animações para deixar a página bonita.' },
    js:    { name: 'JavaScript', color: '#e5b800', desc: 'Dá vida à página: variáveis, funções, eventos e manipulação da tela.' },
    php:   { name: 'PHP',        color: '#777bb3', desc: 'Linguagem de servidor para processar dados antes de enviar a página.' },
    mysql: { name: 'MySQL',      color: '#00758f', desc: 'Banco de dados relacional. Aqui você roda comandos SQL de verdade.' }
};

const LESSONS = {

html: [
{
    id: 'html-1', title: 'Introdução ao HTML', lang: 'html',
    body: `<p><strong>HTML</strong> (HyperText Markup Language) é a linguagem que define a <em>estrutura</em> de uma página web. Ela usa <strong>tags</strong>, como <code>&lt;h1&gt;</code> e <code>&lt;p&gt;</code>, para dizer ao navegador o que cada pedaço de conteúdo representa.</p>
<p>Todo documento começa com <code>&lt;!DOCTYPE html&gt;</code>. O conteúdo visível fica dentro de <code>&lt;body&gt;</code>; informações da página (como o título da aba) ficam em <code>&lt;head&gt;</code>.</p>`,
    code: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Minha página</title>
</head>
<body>
  <h1>Olá, mundo!</h1>
  <p>Este é o meu primeiro parágrafo.</p>
</body>
</html>`,
    quiz: { q: 'O que significa HTML?', o: ['HyperText Markup Language', 'Home Tool Markup Language', 'Hyper Transfer Mode Language'], a: 0 }
},
{
    id: 'html-2', title: 'Elementos e atributos', lang: 'html',
    body: `<p>Um <strong>elemento</strong> é formado pela tag de abertura, o conteúdo e a tag de fechamento: <code>&lt;p&gt;Texto&lt;/p&gt;</code>. Alguns elementos, como <code>&lt;hr&gt;</code> e <code>&lt;br&gt;</code>, não têm fechamento.</p>
<p><strong>Atributos</strong> dão informações extras e ficam na tag de abertura, no formato <code>nome="valor"</code>. Por exemplo, o atributo <code>href</code> define o destino de um link.</p>`,
    code: `<h1>Títulos e textos</h1>
<p>Um parágrafo com <strong>negrito</strong> e <em>itálico</em>.</p>
<a href="https://www.EEAprendizando.com" target="_blank">Visitar o EEAprendizando</a>
<hr>
<button onclick="alert('Olá!')">Clique aqui</button>`,
    quiz: { q: 'Qual atributo define o destino de um link?', o: ['src', 'href', 'title'], a: 1 }
},
{
    id: 'html-3', title: 'Listas e tabelas', lang: 'html',
    body: `<p>Use <code>&lt;ul&gt;</code> para listas com marcadores, <code>&lt;ol&gt;</code> para listas numeradas e <code>&lt;li&gt;</code> para cada item.</p>
<p>Tabelas usam <code>&lt;table&gt;</code>, com linhas <code>&lt;tr&gt;</code>, células de cabeçalho <code>&lt;th&gt;</code> e células de dados <code>&lt;td&gt;</code>.</p>`,
    code: `<h3>Linguagens</h3>
<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
</ul>

<table border="1" cellpadding="6">
  <tr>
    <th>Linguagem</th>
    <th>Uso</th>
  </tr>
  <tr>
    <td>HTML</td>
    <td>Estrutura</td>
  </tr>
  <tr>
    <td>CSS</td>
    <td>Estilo</td>
  </tr>
</table>`,
    quiz: { q: 'Qual tag cria uma lista numerada?', o: ['<ul>', '<ol>', '<li>'], a: 1 }
},
{
    id: 'html-4', title: 'Formulários', lang: 'html',
    body: `<p>Formulários coletam dados do usuário. O elemento <code>&lt;form&gt;</code> agrupa campos como <code>&lt;input&gt;</code>, <code>&lt;select&gt;</code> e <code>&lt;textarea&gt;</code>.</p>
<p>Associe cada campo a um <code>&lt;label&gt;</code> usando <code>for</code> e <code>id</code>. Isso melhora a acessibilidade e deixa o texto clicável.</p>`,
    code: `<form>
  <label for="nome">Nome:</label><br>
  <input type="text" id="nome" placeholder="Seu nome"><br><br>

  <label for="curso">Curso:</label><br>
  <select id="curso">
    <option>HTML</option>
    <option>CSS</option>
    <option>JavaScript</option>
  </select><br><br>

  <input type="checkbox" id="news">
  <label for="news">Quero receber novidades</label><br><br>

  <button type="submit">Enviar</button>
</form>`,
    quiz: { q: 'Qual tag cria uma lista suspensa (dropdown)?', o: ['<input>', '<select>', '<option>'], a: 1 }
},
{
    id: 'html-5', title: 'Tags semânticas', lang: 'html',
    body: `<p>Tags semânticas descrevem o <em>significado</em> do conteúdo: <code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;section&gt;</code>, <code>&lt;article&gt;</code> e <code>&lt;footer&gt;</code>.</p>
<p>Elas ajudam leitores de tela, mecanismos de busca e outros desenvolvedores a entender a página.</p>`,
    code: `<header>
  <h1>Meu Blog</h1>
  <nav>
    <a href="#">Início</a> |
    <a href="#">Sobre</a>
  </nav>
</header>

<main>
  <article>
    <h2>Primeiro post</h2>
    <p>Conteúdo do artigo.</p>
  </article>
</main>

<footer>
  <p>© 2026 Meu Blog</p>
</footer>`,
    quiz: { q: 'Qual tag representa o rodapé da página?', o: ['<bottom>', '<footer>', '<end>'], a: 1 }
}
],

css: [
{
    id: 'css-1', title: 'Introdução e seletores', lang: 'css',
    body: `<p><strong>CSS</strong> (Cascading Style Sheets) controla a aparência do HTML. Uma regra tem um <em>seletor</em> e um bloco de declarações: <code>propriedade: valor;</code>.</p>
<p>Os seletores mais comuns: <code>h1</code> (tag), <code>.classe</code> (classe) e <code>#id</code> (id).</p>`,
    html: `<h1>Meu título</h1>
<p>Texto normal.</p>
<p class="destaque">Texto em destaque.</p>
<p id="unico">Parágrafo com id.</p>`,
    code: `h1 {
  color: #04AA6D;
}

.destaque {
  background-color: #fff3bf;
  padding: 8px;
}

#unico {
  font-style: italic;
}`,
    quiz: { q: 'Qual símbolo seleciona uma classe no CSS?', o: ['# (jogo da velha)', '. (ponto)', '* (asterisco)'], a: 1 }
},
{
    id: 'css-2', title: 'Cores e fundos', lang: 'css',
    body: `<p>Cores podem ser escritas por nome (<code>tomato</code>), hexadecimal (<code>#04AA6D</code>), <code>rgb()</code> ou <code>hsl()</code>. Com <code>rgba()</code> você controla a transparência.</p>
<p>Também dá para usar gradientes com <code>linear-gradient()</code> e cantos arredondados com <code>border-radius</code>.</p>`,
    html: `<div class="caixa">Caixa colorida</div>`,
    code: `.caixa {
  background: linear-gradient(135deg, #04AA6D, #2965f1);
  color: white;
  padding: 30px;
  border-radius: 16px;
  font-size: 22px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
}`,
    quiz: { q: 'Qual propriedade arredonda os cantos de um elemento?', o: ['border-radius', 'corner-style', 'round'], a: 0 }
},
{
    id: 'css-3', title: 'Modelo de caixa (box model)', lang: 'css',
    body: `<p>Todo elemento é uma caixa com quatro camadas, de dentro para fora: <strong>conteúdo</strong>, <code>padding</code> (espaço interno), <code>border</code> (borda) e <code>margin</code> (espaço externo).</p>
<p>Use <code>box-sizing: border-box</code> para que a largura inclua padding e borda. Isso evita muitas surpresas.</p>`,
    html: `<div class="caixa">Conteúdo</div>
<div class="caixa">Outra caixa</div>`,
    code: `.caixa {
  box-sizing: border-box;
  width: 240px;
  padding: 20px;
  border: 3px solid #2965f1;
  margin: 16px;
  background: #eef3ff;
}`,
    quiz: { q: 'Qual propriedade cria espaço DENTRO da borda do elemento?', o: ['margin', 'padding', 'gap'], a: 1 }
},
{
    id: 'css-4', title: 'Flexbox', lang: 'css',
    body: `<p><strong>Flexbox</strong> organiza elementos em uma linha ou coluna. Basta aplicar <code>display: flex</code> no container.</p>
<p>Propriedades úteis: <code>justify-content</code> (alinha no eixo principal), <code>align-items</code> (eixo cruzado) e <code>gap</code> (espaço entre itens).</p>`,
    html: `<div class="container">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
</div>`,
    code: `.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  background: #f1f5f9;
  padding: 16px;
  height: 140px;
}

.item {
  background: #04AA6D;
  color: white;
  padding: 24px;
  border-radius: 8px;
}`,
    quiz: { q: 'Qual valor ativa o Flexbox?', o: ['display: flex;', 'position: flex;', 'layout: flexbox;'], a: 0 }
},
{
    id: 'css-5', title: 'Hover, transições e responsivo', lang: 'css',
    body: `<p>A pseudo-classe <code>:hover</code> aplica estilos quando o mouse passa sobre o elemento, e <code>transition</code> suaviza a mudança.</p>
<p><strong>Media queries</strong> adaptam o layout ao tamanho da tela. No exemplo, o fundo muda quando a janela tem 500px ou menos.</p>`,
    html: `<button class="botao">Passe o mouse</button>
<p class="aviso">Redimensione a janela para ver o efeito.</p>`,
    code: `.botao {
  background: #04AA6D;
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;
}

.botao:hover {
  background: #038a59;
  transform: scale(1.08);
}

@media (max-width: 500px) {
  body { background: #fef3c7; }
}`,
    quiz: { q: 'Qual recurso adapta o estilo ao tamanho da tela?', o: ['@media', ':hover', '@import'], a: 0 }
}
],

js: [
{
    id: 'js-1', title: 'Introdução ao JavaScript', lang: 'js',
    body: `<p><strong>JavaScript</strong> adiciona comportamento às páginas. O comando <code>console.log()</code> exibe valores, e é a melhor forma de testar ideias. No editor, a saída aparece embaixo do resultado.</p>`,
    html: '',
    code: `console.log("Olá, EEA code!");
console.log(2 + 3);
console.log("Soma:", 10 + 5);`,
    quiz: { q: 'Qual comando exibe uma mensagem no console?', o: ['print("oi")', 'console.log("oi")', 'echo "oi"'], a: 1 }
},
{
    id: 'js-2', title: 'Variáveis e tipos', lang: 'js',
    body: `<p>Use <code>let</code> para valores que mudam e <code>const</code> para valores fixos. Os tipos básicos são <em>string</em> (texto), <em>number</em>, <em>boolean</em> (verdadeiro/falso), <em>null</em> e <em>undefined</em>.</p>`,
    html: '',
    code: `const site = "EEA code";
let curtidas = 1500;
curtidas = curtidas + 1;
const ativo = true;

console.log(site);
console.log("Curtidas:", curtidas);
console.log(typeof site, typeof curtidas, typeof ativo);`,
    quiz: { q: 'Qual palavra declara uma constante?', o: ['var', 'let', 'const'], a: 2 }
},
{
    id: 'js-3', title: 'Funções', lang: 'js',
    body: `<p>Funções agrupam código reutilizável. Elas recebem <em>parâmetros</em> e podem devolver um valor com <code>return</code>. As <em>arrow functions</em> são uma sintaxe mais curta.</p>`,
    html: '',
    code: `function soma(a, b) {
  return a + b;
}

const dobro = (n) => n * 2;

console.log(soma(3, 4));
console.log(dobro(21));`,
    quiz: { q: 'Qual palavra devolve um valor de uma função?', o: ['give', 'return', 'output'], a: 1 }
},
{
    id: 'js-4', title: 'DOM e eventos', lang: 'js',
    body: `<p>O <strong>DOM</strong> representa a página como objetos. Com <code>document.getElementById()</code> você acessa um elemento, e com <code>addEventListener()</code> reage a cliques, teclas e outros eventos.</p>`,
    html: `<button id="btn">Clique em mim</button>
<p id="msg">Ninguém clicou ainda.</p>`,
    code: `const botao = document.getElementById("btn");
const msg = document.getElementById("msg");
let cliques = 0;

botao.addEventListener("click", function () {
  cliques++;
  msg.textContent = "Cliques: " + cliques;
});`,
    quiz: { q: 'Qual método escuta um evento de clique?', o: ['addEventListener', 'onListen', 'catchClick'], a: 0 }
},
{
    id: 'js-5', title: 'Arrays e repetições', lang: 'js',
    body: `<p>Arrays guardam listas de valores. Métodos como <code>forEach</code>, <code>map</code> e <code>filter</code> percorrem e transformam os itens sem precisar de um <code>for</code> manual.</p>`,
    html: '',
    code: `const numeros = [1, 2, 3, 4, 5];

numeros.forEach(function (n) {
  console.log("Número:", n);
});

const quadrados = numeros.map((n) => n * n);
const pares = numeros.filter((n) => n % 2 === 0);

console.log("Quadrados:", quadrados);
console.log("Pares:", pares);`,
    quiz: { q: 'Qual método cria um novo array transformando cada item?', o: ['filter', 'map', 'push'], a: 1 }
}
],

php: [
{
    id: 'php-1', title: 'Introdução ao PHP', lang: 'php',
    body: `<p><strong>PHP</strong> roda no <em>servidor</em>: o navegador recebe apenas o resultado em HTML. O código fica entre <code>&lt;?php</code> e <code>?&gt;</code>, e <code>echo</code> escreve texto na página.</p>
<p>Por segurança, esta página não executa PHP digitado por você. Use o botão <em>Ver saída</em> para ver o resultado esperado e rode os exemplos no seu servidor local.</p>`,
    code: `<?php
echo "Olá, mundo!";
?>`,
    out: 'Olá, mundo!',
    quiz: { q: 'Onde o código PHP é executado?', o: ['No navegador', 'No servidor', 'No monitor'], a: 1 }
},
{
    id: 'php-2', title: 'Variáveis', lang: 'php',
    body: `<p>Variáveis em PHP começam com <code>$</code>. Não é preciso declarar o tipo. Textos entre aspas duplas aceitam variáveis dentro deles.</p>`,
    code: `<?php
$nome = "Maria";
$idade = 25;
echo "Meu nome é $nome e tenho $idade anos.";
?>`,
    out: 'Meu nome é Maria e tenho 25 anos.',
    quiz: { q: 'Com qual símbolo uma variável PHP começa?', o: ['@', '$', '#'], a: 1 }
},
{
    id: 'php-3', title: 'Condicionais', lang: 'php',
    body: `<p>Use <code>if</code>, <code>elseif</code> e <code>else</code> para tomar decisões. Os operadores de comparação são <code>==</code>, <code>===</code> (igual e do mesmo tipo), <code>&gt;</code>, <code>&lt;</code>, <code>&gt;=</code> e <code>&lt;=</code>.</p>`,
    code: `<?php
$nota = 7.5;

if ($nota >= 7) {
  echo "Aprovado!";
} elseif ($nota >= 5) {
  echo "Recuperação";
} else {
  echo "Reprovado";
}
?>`,
    out: 'Aprovado!',
    quiz: { q: 'Qual palavra cria uma segunda condição depois do if?', o: ['elseif', 'otherwise', 'elsewhen'], a: 0 }
},
{
    id: 'php-4', title: 'Arrays e foreach', lang: 'php',
    body: `<p>Um array guarda vários valores. O laço <code>foreach</code> percorre cada item, e <code>count()</code> devolve o tamanho. O ponto (<code>.</code>) junta textos.</p>`,
    code: `<?php
$frutas = ["Maçã", "Banana", "Uva"];

foreach ($frutas as $fruta) {
  echo $fruta . "<br>";
}

echo count($frutas) . " frutas";
?>`,
    out: 'Maçã\nBanana\nUva\n3 frutas',
    quiz: { q: 'Qual função devolve a quantidade de itens de um array?', o: ['length()', 'count()', 'size()'], a: 1 }
},
{
    id: 'php-5', title: 'Formulários com $_POST', lang: 'php',
    body: `<p>Quando um formulário usa <code>method="post"</code>, o PHP recebe os campos em <code>$_POST</code>. Sempre trate o texto com <code>htmlspecialchars()</code> antes de exibi-lo, para evitar ataques de XSS.</p>`,
    code: `<form method="post">
  <input type="text" name="nome">
  <button>Enviar</button>
</form>

<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $nome = htmlspecialchars($_POST["nome"]);
  echo "Olá, $nome!";
}
?>`,
    out: 'Se o usuário digitar Maria e enviar:\nOlá, Maria!',
    quiz: { q: 'Qual função protege contra XSS ao exibir texto do usuário?', o: ['htmlspecialchars()', 'strtoupper()', 'trim()'], a: 0 }
}
],

mysql: [
{
    id: 'mysql-1', title: 'SELECT: lendo dados', lang: 'sql',
    body: `<p><strong>MySQL</strong> guarda dados em tabelas. O comando <code>SELECT</code> lê linhas. O asterisco (<code>*</code>) significa "todas as colunas".</p>
<p>Aqui você roda comandos em um MySQL de verdade, na tabela <code>clientes</code> (colunas <code>id</code>, <code>nome</code>, <code>cidade</code> e <code>idade</code>). Se estragar algo, use <em>Restaurar tabela</em>.</p>`,
    code: `SELECT * FROM clientes;`,
    quiz: { q: 'O que o * significa em SELECT * FROM clientes?', o: ['Todas as colunas', 'Apenas a primeira linha', 'Nenhuma coluna'], a: 0 }
},
{
    id: 'mysql-2', title: 'WHERE: filtrando', lang: 'sql',
    body: `<p><code>WHERE</code> filtra as linhas por uma condição. Textos vão entre aspas simples. Combine condições com <code>AND</code> e <code>OR</code>.</p>`,
    code: `SELECT nome, idade
FROM clientes
WHERE cidade = 'São Paulo';`,
    quiz: { q: 'Qual cláusula filtra linhas?', o: ['FILTER', 'WHERE', 'ONLY'], a: 1 }
},
{
    id: 'mysql-3', title: 'ORDER BY e LIMIT', lang: 'sql',
    body: `<p><code>ORDER BY</code> ordena o resultado (<code>ASC</code> crescente, <code>DESC</code> decrescente) e <code>LIMIT</code> restringe a quantidade de linhas.</p>`,
    code: `SELECT nome, idade
FROM clientes
ORDER BY idade DESC
LIMIT 3;`,
    quiz: { q: 'Qual palavra ordena do maior para o menor?', o: ['ASC', 'DESC', 'TOP'], a: 1 }
},
{
    id: 'mysql-4', title: 'INSERT: adicionando', lang: 'sql',
    body: `<p><code>INSERT INTO</code> cria uma nova linha. Informe as colunas e os valores na mesma ordem. Depois, rode um <code>SELECT</code> para conferir.</p>`,
    code: `INSERT INTO clientes (nome, cidade, idade)
VALUES ('Igor Costa', 'Recife', 29);`,
    quiz: { q: 'Qual comando adiciona uma nova linha?', o: ['ADD ROW', 'INSERT INTO', 'CREATE LINE'], a: 1 }
},
{
    id: 'mysql-5', title: 'UPDATE e DELETE', lang: 'sql',
    body: `<p><code>UPDATE</code> altera linhas e <code>DELETE</code> remove. <strong>Sempre use WHERE</strong>: sem ele, o comando atinge a tabela inteira!</p>`,
    code: `UPDATE clientes
SET cidade = 'Campinas'
WHERE nome = 'Ana Souza';`,
    quiz: { q: 'O que acontece em um UPDATE sem WHERE?', o: ['Nada', 'Todas as linhas são alteradas', 'Dá erro sempre'], a: 1 }
},
{
    id: 'mysql-6', title: 'COUNT, AVG e GROUP BY', lang: 'sql',
    body: `<p>Funções de agregação resumem dados: <code>COUNT</code> (quantidade), <code>AVG</code> (média), <code>MAX</code>, <code>MIN</code> e <code>SUM</code>. Com <code>GROUP BY</code>, o cálculo é feito por grupo.</p>`,
    code: `SELECT cidade,
       COUNT(*) AS total,
       AVG(idade) AS media_idade
FROM clientes
GROUP BY cidade;`,
    quiz: { q: 'Qual função calcula a média?', o: ['MEAN', 'AVG', 'MID'], a: 1 }
}
]

};
