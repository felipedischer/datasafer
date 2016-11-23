$(document).ready(function () {
  /*Configurações do sistema*/
  var login = "sheilab";
  var senha = "sheilab";
  var expira = false;

  //Urls do sistema, por ambiente
  var urlLoginProducao            = 'http://senai.datasafer.com.br/gerenciamento/login';
  var urlLoginDesenvolvimento     = 'http://192.168.2.54/Datasafer/gerenciamento/login';

  var urlEstacoesProducao         = 'http://senai.datasafer.com.br/gerenciamento/usuario/estacoes';
  var urlEstacoesDesenvolvimento  = 'http://192.168.2.54/Datasafer/gerenciamento/usuario/estacoes';

  var urlEstacaoProducao          = 'http://senai.datasafer.com.br/gerenciamento/estacao/backups';
  var urlEstacaoDesenvolvimento   = 'http://192.168.2.54/Datasafer/gerenciamento/estacao/backups';

  // produção ou desenvolvimento
  var ambiente = 'producao';

  //Define as urls do ambiente
  /*if (ambiente == 'producao') {
      rlLogin    =   urlLoginProducao;
  } else {
    rlLogin    =   urlLoginDesenvolvimento;
  }*/
  var urlLogin    = (ambiente == 'producao') ? urlLoginProducao     : urlLoginDesenvolvimento;
  var urlEstacoes = (ambiente == 'producao') ? urlEstacoesProducao  : urlEstacoesDesenvolvimento;
  var urlEstacao  = (ambiente == 'producao') ? urlEstacaoProducao   : urlEstacaoDesenvolvimento;

  var token        = '';
  var estacoes     = [];
  var estacaoAtual = {};

  /*
   * Anexa os eventos aos componentes da página
   
    document.getElementById('logar').addEventListener('click', logar);
    document.getElementById('getEstacoes').addEventListener('click', retornaEstacoes);
    document.getElementById('montarEstacoes').addEventListener('click', montarEstacoes);
 */ 

  document.getElementById('json-local').addEventListener('click', teste); 

  $(document).delegate('.estacao', 'click', function(){
    //estacaoEspecificacao();
    estacaoEspecificacao('estacao-pccasa.json');
  });

    
    //******************* Funções ajax para composição da página *********************
    function teste(){
      //simula o login
      tokek = "t2roerh989c5h0jc9dskdm966tn7tp8omaraknrsa2p36nje78eiu2kd1dmmioori3kal625s6m0itp2dbvc43afspjn9kkqt9m57lrtr8naudff85msh5jdsst2fjb";
      
      retornaEstacoes();

    }

    function logar(){
      
        $.ajax({

          url: urlLogin,
          type : 'post',
          data :'{"login": '+login+', "senha" : '+senha+', "expira" : '+expira+'}',
          crossDomain : true,
          contentType: "application/json",
          success : function ( data ) {
            
            token = data.token;
            console.log("O token: " + token);
            retornaEstacoes();

            
          },
          error : function( error ){
            console.log("Errrrrrrrroooooo: " + error);
          }
      });
        
    }

    function retornaEstacoes (){
      /* ATENÇÃO: é necessário usar um servidor/brouser-synbc etc 
       *  pois o getJSON não funciona sobre o protocolo file
       */
      $.getJSON("./data/usuario-estacoes.json", function( json ) {
            estacoes = json;
            montarEstacoes();
      });

      /* função real, ajax que não está funcionando com chamamada do servidor online.. sem tempo de desecobrir o por quê!!
      

      if(token.trim().length > 0){
        
        $.ajax({
          url: urlEstacoes,
          headers: { "Authorization": token},
          type : 'get',
          crossDomain : true,
          contentType: "application/json",
          dataType: 'json',
          
          success : function ( data ) {
            //console.log(data);

            if(data.length > 0){
              estacoes = data;
              
              montarEstacoes();
              //console.log(estacoes);

            }

          }
        });

      } else {
        console.log('Problemas no login, favor verificar com o programador!!');
      }
      */
    }


   function montarEstacoes(){
      
      if( estacoes.length > 0 ){
        
        var maquinas = montaTemplateEstacoes(estacoes);
        document.getElementById('templateEstacoes').innerHTML = maquinas;
      }
   }


   function montaTemplateEstacoes( arrEstacoes ){
    
    var template = "";

    if( arrEstacoes.length > 0  ){
      
      template += '<h5>Detalhes do Backup</h5>';
      template +=  '<table class="table table-responsive table-striped table-hover my">';
      template += '<tbody>';

      for(var i = 0; i < arrEstacoes.length; i++ ){
        
        template +=     '<tr>';
        template +=       '<td><a href="javascript:void(0);" class="estacao" nome="'+arrEstacoes[i].nome+'" >' +arrEstacoes[i].nome+ '</a></td>';
        template +=     '</tr>';  
      } 

      template +=   '</tbody>';
      template += '</table>';
    }

    return template;

  }

  //Pega as especificações de uma máquina específica

  function estacaoEspecificacao( nomeEstacao ){

    $.getJSON("./data/"+nomeEstacao, function( json ) {
        montaTemplateEstacao(json);            
      });

      /*
      $.ajax({

          url: urlEstacao,
          type : 'get',
          headers : { "Authorization" : token, "estacao" : nomeEstacao },
          crossDomain : true,
          success : function ( data ) {
            
            console.log(data);
            montaTemplateEstacao(data);

          },
          error : function( error ){
            console.log(error);
          }
      });
      */
  }


  function montaTemplateEstacao( estacao ){
    console.log(estacao);
    //return false;
    
    var template = "";
    for (var i = 0; i < estacao.length; i++){
      template += '<tr>';
      template += '<td>'+estacao[i].nome+'</td>';
      template += '<td>'+byteParaGiga(estacao[i].armazenamento_ocupado)+'GB</td>';
      template += '<td>'+estacao[i].ultima_operacao.data+'</td>';
      template += '<td>'+estacao[i].ultima_operacao.status+'</td>';
      template += '</tr>';
    }

    
    document.getElementById('especificacoesMaquina').innerHTML = template;
      
    //return template;
  }

  function byteParaGiga(byte){
    return (byte / 1024) / 1024; 
  }

  logar();//deverá ser chamada no login

});//fim do ready()
