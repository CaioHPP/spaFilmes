import { emCartaz } from "./servicoAPI.js";

import { buscaFilme } from "./servicoAPI.js";

import { detalhesFilme } from "./servicoAPI.js";

import { generosExistentes } from "./servicoAPI.js";

import { getGenero } from "./servicoAPI.js";

import { filmesTopzeira } from "./servicoAPI.js";

window.onload = function () {
  function montaDetalhes() {
    return `<div id="conteudoIndex">
  <div class="conteudoDetalhes">
    <section class="inner-content nova-sessao" id="sessao">
      <div class="detalhes-filme" id="grad">
        <div class="poster">
          <img alt="Imagem do Filme" id="posterFilme" />
        </div>
        <div class="conteudo-filme">
          <div class="titulo">
            <h2 id="nomeFilme"></h2>
            <span class="data" id="anoFilme"></span>
          </div>
          <div class="descricao">
            <div class="informacoes">
              <span class="classificao" id="classificacao"></span>
              <span class="dataFilme" id="dataFilme"></span>
              <div class="genero">
                <ol class="generos" id="generos">
                </ol>
              </div>
              <span class="material-symbols-outlined"> schedule </span>
              <span class="duracao" id="duracao"></span>
            </div>
            <div class="sinopse">
              <h3>Sinopse</h3>
              <div class="texto">
                <p id="overview"></p>
              </div>
            </div>
            <div class="arte">
              <ol id="criacao">
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="inner-content nova-sessao">
      <div class="conteudo-filmes">
        <div class="header-section">
          <h2>Elenco Principal</h2>
        </div>
        <div class="midia">
          <div class="colunas" id="pessoas">
          </div>
        </div>
      </div>
    </section>
    </div>
    </div>
`;
  }

  function montaResultado() {
    return `<div class="conteudoPesquisa">
    <section class="resultadosBusca">
      <div class="containerResultados">
        <div class="midia">
          <div id="resultadosBusca" class="colunas resultado"></div>
        </div>
      </div>
    </section>
  </div>`;
  }

  function montaColuna(filme, tipo) {
    const divColuna = document.createElement("div");
    const divImagem = document.createElement("div");
    const aImagem = document.createElement("a");
    const img = document.createElement("img");
    const divInformacoes = document.createElement("div");
    const aNome = document.createElement("a");

    divColuna.classList.add(tipo);
    divColuna.classList.add("coluna");
    divImagem.classList.add("imagem");
    aImagem.classList.add("imagem");
    divInformacoes.classList.add("informacoes");

    let caminho = "";
    if (filme.poster_path || filme.profile_path) {
      caminho = `https://image.tmdb.org/t/p/w500/${
        filme.poster_path || filme.profile_path
      }`;
    } else {
      caminho =
        "https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg";
    }

    img.setAttribute("src", caminho);
    aImagem.appendChild(img);
    divImagem.appendChild(aImagem);
    aNome.append(filme.title || filme.name);

    if (tipo === "pessoa") {
      const h4 = document.createElement("h4");
      const h5 = document.createElement("h5");
      h4.appendChild(aNome);
      h5.append(filme.character);
      divInformacoes.appendChild(h4);
      divInformacoes.appendChild(h5);
      divInformacoes.style.width = "auto";
    } else if (tipo.includes("botao")) {
      divImagem.classList.remove("imagem");
      aImagem.classList.remove("imagem");
      aImagem.removeChild(img);
      divImagem.remove(aImagem);
      const span = document.createElement("span");
      span.classList.add("material-symbols-outlined");

      if (tipo === "botaoVoltar") {
        span.append("arrow_back");
        divImagem.style.width = "150px";
        divImagem.setAttribute("onclick", `proxPagina(${filme})`);
        divImagem.classList.add("avancarEVoltar");
      } else if (tipo === "botaoAvancar") {
        span.append("arrow_forward");
        divImagem.style.width = "150px";
        divImagem.setAttribute("onclick", `proxPagina(${filme})`);
        divImagem.classList.add("avancarEVoltar");
      } else if (tipo === "botaoMais") {
        span.append("add_circle");
        aImagem.setAttribute("onclick", `proxPagina(${filme})`);
        divImagem.classList.add("avancarBusca");
        divColuna.style.border = 0;
        divColuna.setAttribute("id", "botaoMais");
      }
      aImagem.appendChild(span);

      divImagem.appendChild(aImagem);
      divColuna.classList.add("filme");
      divColuna.classList.add("pesquisa");
      divColuna.append(divImagem);

      return divColuna;
    } else {
      if (tipo === "pesquisa") {
        divColuna.classList.add("filme");
      }
      const h2 = document.createElement("h2");
      const divGenero = document.createElement("div");
      const ul = document.createElement("ul");
      const dataLancamento = document.createElement("p");
      const divDescricao = document.createElement("div");

      divGenero.classList.add("genero");
      ul.classList.add("generos");
      divDescricao.classList.add("overview");

      h2.appendChild(aNome);
      divInformacoes.appendChild(h2);
      divGenero.appendChild(ul);
      dataLancamento.append(filme.release_date || "");

      ul.setAttribute("id", filme.id);
      aNome.setAttribute("onclick", `abrirFilme(${filme.id})`);
      aImagem.setAttribute("onclick", `abrirFilme(${filme.id})`);

      filme.genre_ids.forEach((genero_id) => {
        const li = document.createElement("li");
        const aLi = document.createElement("a");
        aLi.setAttribute("name", "generoLi");
        generos.then((genres) => {
          aLi.append(getGenero(genero_id, genres.genres));
        });

        li.appendChild(aLi);
        ul.appendChild(li);
      });
      if (filme.overview) {
        const descricaoH3 = document.createElement("h3");
        descricaoH3.append(`Descricao: `);
        divDescricao.appendChild(descricaoH3);
        divDescricao.append("\n");
        divDescricao.append(filme.overview || "Descricao Nao Adicionada");
      }

      divInformacoes.appendChild(divGenero);
      divInformacoes.appendChild(dataLancamento);
      divInformacoes.appendChild(divDescricao);
    }
    divColuna.appendChild(divImagem);
    divColuna.appendChild(divInformacoes);

    return divColuna;
  }

  function montaLinhas(filme, tipo, indice) {
    const tr = document.createElement("tr");
    tr.setAttribute("ordenacao", "");
    if (tipo === "botao") {
      const divBotao = document.createElement("div");
      const botao = document.createElement("span");
      botao.append("expand_more");
      botao.classList.add("material-symbols-outlined");
      divBotao.appendChild(botao);
      divBotao.classList.add("botaoMais");
      divBotao.setAttribute("onclick", `expandirTopRated(${indice})`);
      divBotao.setAttribute("id", "expandeLista");
      return divBotao;
    }
    const tdRank = document.createElement("td");
    const tdNome = document.createElement("td");
    const tdNota = document.createElement("td");
    const tdNVotos = document.createElement("td");
    const tdAnoLancamento = document.createElement("td");
    const aNome = document.createElement("a");
    const spanToolTip = document.createElement("span");
    const divImg = document.createElement("div");
    const imagem = document.createElement("img");
    const divOver = document.createElement("div");
    const ul = document.createElement("ul");
    const h2 = document.createElement("h2");
    const divGenero = document.createElement("div");
    const over = document.createElement("p");
    const nome = document.createElement("h2");
    const dataLancamento = document.createElement("h3");

    aNome.classList.add("celulaNome");
    aNome.classList.add("tooltip");
    spanToolTip.classList.add("tooltipContent");
    divImg.classList.add("tooltipImagem");
    divOver.classList.add("tooltipTexto");
    divGenero.classList.add("genero");
    ul.classList.add("generos");

    nome.setAttribute("onclick", `abrirFilme(${filme.id})`);

    let caminho = "";
    if (filme.poster_path) {
      caminho = `https://image.tmdb.org/t/p/w500/${filme.poster_path}`;
    } else {
      caminho =
        "https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg";
    }

    imagem.setAttribute("src", caminho);
    imagem.setAttribute("onclick", `abrirFilme(${filme.id})`);

    nome.append(filme.title);
    aNome.append(nome);
    h2.append(filme.title);
    h2.setAttribute("onclick", `abrirFilme(${filme.id})`);
    if (filme.release_date)
      dataLancamento.append(
        new Date(filme.release_date).toLocaleDateString("pt-BR")
      );
    if (filme.overview) over.append(filme.overview);

    filme.genre_ids.forEach((genero_id) => {
      const li = document.createElement("li");
      const aLi = document.createElement("a");
      aLi.setAttribute("name", "generoLi");
      generos.then((genres) => {
        aLi.append(getGenero(genero_id, genres.genres));
        tdNome.classList.add(`${genero_id}`);
      });
      li.appendChild(aLi);
      ul.appendChild(li);
    });

    tdRank.classList.add("celulaOrdem");
    tdNota.classList.add("celulaNota");
    tdNVotos.classList.add("celulaVotos");
    tdAnoLancamento.classList.add("celulaAno");

    divImg.appendChild(imagem);
    divGenero.appendChild(ul);
    divOver.appendChild(h2);
    divOver.appendChild(dataLancamento);
    divOver.appendChild(divGenero);
    divOver.append(over);
    spanToolTip.appendChild(divImg);
    spanToolTip.appendChild(divOver);
    aNome.appendChild(spanToolTip);

    tdRank.append(indice);
    tdNome.append(aNome);
    tdNota.append(filme.vote_average);
    tdNVotos.append(filme.vote_count);
    tdAnoLancamento.append(new Date(filme.release_date).getFullYear());
    tdAnoLancamento.setAttribute("data", filme.release_date);

    tr.appendChild(tdRank);
    tr.appendChild(tdNome);
    tr.appendChild(tdNota);
    tr.appendChild(tdNVotos);
    tr.appendChild(tdAnoLancamento);
    return tr;
  }

  function ordenaPor() {
    let filmes = [];
    let ordem = document.getElementById("ordemPorVoto").value;

    document.querySelectorAll("[ordenacao]").forEach((tr) => {
      filmes.push(tr);
    });
    if (ordem === "votosMaior") {
      filmes.sort(
        (a, b) =>
          Number(b.children[3].innerHTML) - Number(a.children[3].innerHTML)
      );
    } else if (ordem === "votosMenor") {
      filmes.sort(
        (a, b) =>
          Number(a.children[3].innerHTML) - Number(b.children[3].innerHTML)
      );
    } else {
      return 1;
    }
    let tagPai = document.getElementById("topRatedFilmes");
    tagPai.innerHTML = "";
    filmes.forEach((filme, indice) => {
      filme.children[0].innerHTML = indice + 1;
      tagPai.appendChild(filme);
    });
  }

  function filtrarPor(dataMin, dataMax, generos) {
    let filmes = [];
    document.querySelectorAll("[ordenacao]").forEach((tr) => {
      filmes.push(tr);
    });

    if (dataMin) {
      const dataMenor = (filme) =>
        filme.children[4].getAttribute("data") >= dataMin;
      filmes = filmes.filter(dataMenor);
    }
    if (dataMax) {
      const dataMaior = (filme) =>
        filme.children[4].getAttribute("data") <= dataMax;
      filmes = filmes.filter(dataMaior);
    }
    if (generos.length) {
      generos.forEach((genero) => {
        filmes = filmes.filter((filme) =>
          filme.children[1].classList.contains(genero)
        );
      });
    }
    let tagPai = document.getElementById("topRatedFilmes");
    tagPai.innerHTML = "";
    filmes.forEach((filme, indice) => {
      filme.children[0].innerHTML = indice + 1;
      tagPai.appendChild(filme);
    });
  }

  function atualizaBusca(resultados) {
    let tagPai = document.getElementById("resultadosBusca");

    resultados.forEach((filme) => {
      tagPai.appendChild(montaColuna(filme, "pesquisa"));
    });
  }

  function atualizaDetalhesFilme(filme) {
    let caminho = "";
    if (filme.poster_path) {
      caminho = `https://image.tmdb.org/t/p/w500/${filme.poster_path}`;
    } else {
      caminho =
        "https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg";
    }
    let caminho2 = "";
    if (filme.backdrop_path) {
      caminho2 = `https://image.tmdb.org/t/p/original/${filme.backdrop_path}`;
    }
    let back = document.getElementById("sessao");
    back.style.backgroundImage = `url(${caminho2})`;
    back.style.display = "block";
    let grad = document.getElementById("grad");
    grad.style.backgroundImage =
      "linear-gradient(to right, rgb(26, 26, 26) 150px, rgba(60, 61, 62, 0.84) 100%)";
    let poster = document.getElementById("posterFilme");
    poster.setAttribute("src", caminho);
    let nomeFilme = document.getElementById("nomeFilme");
    nomeFilme.append(filme.title);
    let anoFilme = document.getElementById("anoFilme");
    let data = new Date(filme.release_date);
    anoFilme.append(`(${data.getFullYear()})`);
    let classificacao = document.getElementById("classificacao");
    classificacao.append(
      filme.releases.countries.find(
        (certificacao) => certificacao.iso_3166_1 === "BR"
      ).certification
    );
    let dataFilme = document.getElementById("dataFilme");
    dataFilme.append(data.toLocaleDateString("pt-BR"));

    let ol = document.getElementById("generos");
    filme.genres.forEach((genero) => {
      const li = document.createElement("li");
      li.setAttribute("name", "generoLi");
      li.append(genero.name);
      ol.appendChild(li);
    });
    let duracao = document.getElementById("duracao");
    duracao.append(`${Math.floor(filme.runtime / 60)}h${filme.runtime % 60}m`);
    let overview = document.getElementById("overview");
    overview.append(filme.overview);

    let criacao = document.getElementById("criacao");
    let criadores = filme.credits.crew.filter((pessoa) => {
      return (
        pessoa.job === "Director" ||
        pessoa.job === "Screenplay" ||
        pessoa.job === "Writer" ||
        pessoa.job === "Characters"
      );
    });
    criadores.sort(function (a, b) {
      return b.popularity - a.popularity;
    });
    criadores.forEach((criador) => {
      const novoCriador = document.createElement("li");
      const h4 = document.createElement("h4");
      const h5 = document.createElement("h5");
      novoCriador.classList.add("perfil");
      h4.classList.add("nome");
      h5.classList.add("papel");
      h4.append(criador.name);
      h5.append(criador.job);
      novoCriador.append(h4);
      novoCriador.append(h5);
      criacao.appendChild(novoCriador);
    });

    const elenco = document.getElementById("pessoas");
    let atores = filme.credits.cast.filter((pessoa) => {
      return pessoa.known_for_department === "Acting";
    });
    atores.sort(function (a, b) {
      return b.popularity - a.popularity;
    });
    atores.every((ator, indice) => {
      if (indice > 9) {
        return false;
      }
      elenco.appendChild(montaColuna(ator, "pessoa"));
      return true;
    });
  }

  function atualizaFiltro() {
    let ul = document.getElementById("generos");
    generos.then((genres) => {
      genres.genres.forEach((genero) => {
        const li = document.createElement("li");
        const aLi = document.createElement("a");
        li.setAttribute("onclick", `ativar(${genero.id})`);
        aLi.id = genero.id;
        aLi.append(genero.name);
        li.appendChild(aLi);
        ul.appendChild(li);
      });
    });
  }

  let totalTopRated = 1;
  function atualizaTopRated(ordem = "melhorAvaliacao", pagina = 0) {
    if (!pagina) {
      if (ordem === "menorAvaliacao") {
        pagina = totalTopRated;
      } else {
        pagina = 1;
      }
    }
    let tagPai = document.getElementById("topRatedFilmes");
    filmesTopzeira(pagina)
      .then(({ data }) => {
        pagina = data.page;
        totalTopRated = data.total_pages;
        return data.results;
      })
      .then((filmes) => {
        if (ordem === "menorAvaliacao") {
          filmes = filmes.reverse();
        }
        filmes.forEach((filme, indice) => {
          if (pagina > 1 && pagina !== totalTopRated) {
            try {
              indice =
                document.getElementById("topRatedFilmes").lastChild.firstChild
                  .innerHTML;
            } catch {
              indice = 0;
            }
          }
          tagPai.appendChild(montaLinhas(filme, "filme", Number(indice) + 1));
        });
      })
      .then(() => {
        document.getElementById("expandeLista").remove();
        let proxPag = pagina + 1;
        if (ordem === "menorAvaliacao") {
          proxPag = pagina - 1;
        }
        tagPai.parentNode.insertBefore(
          montaLinhas("", "botao", proxPag),
          tagPai.nextSibling
        );
        if (document.getElementById("ordemPorVoto").value) {
          ordenaPor();
        }
      });
  }

  function atualizaEmCartaz(pagina = 1) {
    let total = 1;
    let tagPai = document.getElementById("nosCinemas");
    tagPai.innerHTML = "";
    if (pagina > 1) {
      tagPai.appendChild(montaColuna(pagina - 1, "botaoVoltar"));
    }
    emCartaz(pagina)
      .then(({ data }) => {
        pagina = data.page;
        total = data.total_pages;
        return data.results;
      })
      .then((filmes) => {
        filmes.forEach((filme) => {
          tagPai.appendChild(montaColuna(filme, "filme"));
        });
      })
      .then(() => {
        if (pagina < total) {
          tagPai.appendChild(montaColuna(pagina + 1, "botaoAvancar"));
        }
      });
  }

  const generos = generosExistentes().then(({ data }) => {
    return data;
  });

  window.abrirAba = function (id) {
    let tagDivPai = document.getElementById(id);
    let tagDivFilho = tagDivPai.children.aba.classList;
    tagDivFilho.toggle("closed");
    tagDivFilho.contains("closed")
      ? (tagDivPai.getElementsByTagName("span").icone.innerHTML =
          "chevron_right")
      : (tagDivPai.getElementsByTagName("span").icone.innerHTML =
          "expand_more");
  };

  window.abrirFilme = function (id) {
    let filme = document.getElementById("conteudoSite");
    filme.innerHTML = montaDetalhes();
    detalhesFilme(id)
      .then(({ data }) => {
        return data;
      })
      .then(atualizaDetalhesFilme);
  };

  window.proxPagina = function (pagina) {
    if (query) {
      carregaPesquisa(query, pagina);
    } else {
      atualizaEmCartaz(pagina);
    }
  };

  window.expandirTopRated = function (pagina = 0) {
    if (pagina) {
      atualizaTopRated(
        document.getElementById("ordemApresentacao").value,
        pagina
      );
    }
  };

  window.ativar = function (id) {
    document.getElementById(id).parentNode.classList.toggle("filtroAtivo");
    document.getElementById(id).classList.toggle("ativo");
  };

  window.onscroll = function () {
    if (document.getElementById("index").hasAttribute("pesquisa")) {
      if (document.getElementById("index").getAttribute("pagina") > -1) {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
          console.log(document.getElementById("index").getAttribute("pagina"));
          carregaPesquisa(
            query,
            Number.parseInt(
              document.getElementById("index").getAttribute("pagina")
            ) + 1
          );
        }
      }
    }
  };

  function carregaIndex() {
    document.getElementById("index").removeAttribute("pesquisa");
    document.getElementById("index").removeAttribute("pagina");
    try {
      query = "";
      let conteudo = document.getElementById("conteudoSite");
      fetch("./conteudoIndex.html")
        .then((resp) => resp.text())
        .then((html) => {
          conteudo.innerHTML = html;
          atualizaFiltro();
          atualizaEmCartaz();
          atualizaTopRated();
        });
    } catch {
      console.log("DEU ERRO");
      document.location.reload(true);
    }
  }

  function carregaPesquisa(query, pagina = 0) {
    document.getElementById("index").setAttribute("pesquisa", true);
    let total = 0;
    buscaFilme(query, pagina)
      .then(({ data }) => {
        pagina = data.page;
        total = data.total_pages;
        return data.results;
      })
      .then(atualizaBusca)
      .then(() => {
        if (pagina < total) {
          document.getElementById("index").setAttribute("pagina", pagina);
        } else {
          document.getElementById("index").setAttribute("pagina", -1);
        }
      });
  }

  const abaIndex = document.querySelector("[classe-home]");
  abaIndex.onclick = function (e) {
    e.preventDefault();
    ultimaBusca = "";
    carregaIndex();
  };

  const abaPesquisa = document.querySelector("[classe-pesquisa]");
  let ultimaBusca = "";
  let query = "";
  abaPesquisa.onclick = function (e) {
    e.preventDefault();
    query = abaPesquisa.form.query.value;
    if (query && ultimaBusca !== query) {
      let pesquisa = document.getElementById("conteudoIndex");
      pesquisa.innerHTML = montaResultado();
      ultimaBusca = query;
      carregaPesquisa(query);
    }
  };

  const ordemApresentacao = document.getElementById("ordemApresentacao");
  ordemApresentacao.onchange = function (e) {
    document.getElementById("topRatedFilmes").innerHTML = "";
    atualizaTopRated(ordemApresentacao.value);
    ordemPorVotos.options[0].selected = true;
    ordemApresentacao.focus();
  };

  const ordemPorVotos = document.getElementById("ordemPorVoto");
  ordemPorVotos.onchange = function (e) {
    if (ordemPorVotos.value) {
      ordenaPor();
    } else {
      document.getElementById("topRatedFilmes").innerHTML = "";
      atualizaTopRated(ordemApresentacao.value);
    }
    ordemPorVotos.focus();
  };

  const filtrar = document.getElementById("botaoFiltrar");
  filtrar.onclick = function (e) {
    const dataMin = document.getElementById("dataMin").value;
    const dataMax = document.getElementById("dataMax").value;
    const generosFiltrados = document.querySelectorAll(".ativo");
    let generosExigidos = [];
    generosFiltrados.forEach((genero) => {
      generosExigidos.push(genero.id);
    });
    if (dataMin || dataMax || generosExigidos.length) {
      filtrarPor(dataMin, dataMax, generosExigidos);
      document
        .getElementById("botaoRestaurar")
        .parentNode.classList.remove("closed");
    } else {
      document.getElementById("topRatedFilmes").innerHTML = "";
      document
        .getElementById("botaoRestaurar")
        .parentNode.classList.add("closed");
      ordemPorVotos.options[0].selected = true;
      atualizaTopRated(ordemApresentacao.value);
    }
  };

  const restaurar = document.getElementById("botaoRestaurar");
  restaurar.onclick = function (e) {
    document.getElementById("topRatedFilmes").innerHTML = "";
    atualizaTopRated(ordemApresentacao.value);
    restaurar.parentNode.classList.add("closed");
    ordemPorVotos.options[0].selected = true;
  };

  atualizaEmCartaz();
  atualizaTopRated();
  atualizaFiltro();
};
