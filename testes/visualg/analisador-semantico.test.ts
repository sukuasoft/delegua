import { AnalisadorSemanticoVisuAlg } from '../../fontes/analisador-semantico/dialetos/analisador-semantico-visualg'
import { AvaliadorSintaticoVisuAlg } from "../../fontes/avaliador-sintatico/dialetos";
import { LexadorVisuAlg } from "../../fontes/lexador/dialetos";

describe('Analisador sêmantico (VisuAlg)', () => {
    describe('analisar()', () => {
        let lexador: LexadorVisuAlg;
        let avaliadorSintaticoVisuAlg: AvaliadorSintaticoVisuAlg;
        let analisadorSemanticoVisuAlg: AnalisadorSemanticoVisuAlg

        beforeEach(() => {
            lexador = new LexadorVisuAlg();
            avaliadorSintaticoVisuAlg = new AvaliadorSintaticoVisuAlg();
            analisadorSemanticoVisuAlg = new AnalisadorSemanticoVisuAlg();
        });


        describe('Cenários de falha', () => {
            it('Variável indefinida, não declarada (escreva)', () => {
                const retornoLexador = lexador.mapear([
                    'algoritmo "Declaração de variável"',
                    'var',
                    'inicio',
                    'escreva(idade, "teste");',
                    'fimalgoritmo'
                ], -1);
                const retornoAvaliadorSintatico = avaliadorSintaticoVisuAlg.analisar(retornoLexador, -1);
                const retornoAnalisadorSemantico = analisadorSemanticoVisuAlg.analisar(retornoAvaliadorSintatico.declaracoes);
                expect(retornoAnalisadorSemantico).toBeTruthy();
                expect(retornoAnalisadorSemantico.diagnosticos).toHaveLength(1);
            });

            it('Variável indefinida, não declarada (atribuição)', () => {
                const retornoLexador = lexador.mapear([
                    'algoritmo "Atribuição de valor"',
                    'var',
                    'inicio',
                    'idade <- 2',
                    'fimalgoritmo'
                ], -1);

                const retornoAvaliadorSintatico = avaliadorSintaticoVisuAlg.analisar(retornoLexador, -1);
                const retornoAnalisadorSemantico = analisadorSemanticoVisuAlg.analisar(retornoAvaliadorSintatico.declaracoes);
                expect(retornoAnalisadorSemantico).toBeTruthy();
                expect(retornoAnalisadorSemantico.diagnosticos).toHaveLength(1);
            });

            it('Atribuição inválida', () => {
                const retornoLexador = lexador.mapear([
                    'algoritmo "Atribuição de valor"',
                    'var',
                    'idade: real',
                    'inicio',
                    'idade <- "2"',
                    'fimalgoritmo'
                ], -1);

                const retornoAvaliadorSintatico = avaliadorSintaticoVisuAlg.analisar(retornoLexador, -1);
                const retornoAnalisadorSemantico = analisadorSemanticoVisuAlg.analisar(retornoAvaliadorSintatico.declaracoes);
                expect(retornoAnalisadorSemantico).toBeTruthy();
                expect(retornoAnalisadorSemantico.diagnosticos).toHaveLength(1);
            });

            it('Atribuição inválida de variáveis', () => {
                const retornoLexador = lexador.mapear([
                    'algoritmo "Atribuição inválida de variáveis"',
                    'var x: real',
                    'y: inteiro',
                    'a: caractere',
                    'l: logico',
                    'inicio',
                    'x <- "25"',
                    'y <- "6x"',
                    'a <- 0',
                    'l <- "verdadeiro e falso"',
                    'fimalgoritmo'
                ], -1);

                const retornoAvaliadorSintatico = avaliadorSintaticoVisuAlg.analisar(retornoLexador, -1);
                const retornoAnalisadorSemantico = analisadorSemanticoVisuAlg.analisar(retornoAvaliadorSintatico.declaracoes);
                expect(retornoAnalisadorSemantico).toBeTruthy();
                expect(retornoAnalisadorSemantico.diagnosticos).toHaveLength(4);
            });

            it("Chamada de função inexistente", () => {
                const retornoLexador = lexador.mapear([
                    'algoritmo "definindo função"',
                    'var',
                    'resultado: caracter',
                    'inicio',
                    'saudacao(4);',
                    'fimalgoritmo'
                ], -1)

                const retornoAvaliadorSintatico = avaliadorSintaticoVisuAlg.analisar(retornoLexador, -1);
                const retornoAnalisadorSemantico = analisadorSemanticoVisuAlg.analisar(retornoAvaliadorSintatico.declaracoes);
                expect(retornoAnalisadorSemantico).toBeTruthy();
                expect(retornoAnalisadorSemantico.diagnosticos).toHaveLength(1);
            })

            it("Chamada de função com número de parametro diferentes", () => {
                const retornoLexador = lexador.mapear([
                    'algoritmo "definindo função"',
                    'var',
                    'resultado: caracter',
                    'função saudacao(nome: caracter): caracter',
                    'var',
                    'inicio',
                    'retorna "Bem vindo " + nome',
                    'fimfunção',
                    'inicio',
                    'saudacao(4);',
                    'fimalgoritmo'
                ], -1)

                const retornoAvaliadorSintatico = avaliadorSintaticoVisuAlg.analisar(retornoLexador, -1);
                const retornoAnalisadorSemantico = analisadorSemanticoVisuAlg.analisar(retornoAvaliadorSintatico.declaracoes);
                expect(retornoAnalisadorSemantico).toBeTruthy();
                expect(retornoAnalisadorSemantico.diagnosticos).toHaveLength(1);
            })
        })
    })
})