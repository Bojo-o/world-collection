Uvod
    Problematika
        - chceme si zaznamenavat miesta ktore sme navstivil/chceme este len navstivit a infromacie k nim (poznamky, datum navstevy)
        - taktiez chceme vyhadavat miesta ktore odpovedaju nasim obmezdeniam (chcem navstivit co, kde , co to ma splnat)
    Podobna aplikacia - Google maps
        - co uz existuje na google mapach
        - vieme si zaznamenavat objecty na mape, zapisat si poznamky, nastavit ikonku markeru na mape
        - inspicaria z tejto webovej sluzby
    Problem 
        - co google maps nevedia
        - neviem detailnejsie vyhladatav veci ktore by sme chceli navstativit
        - neexistuju filtre, ktorymi by sme viacej specifikovali o co mame zaujem
    World collections
        - vlastna webova aplikacia/projekt
        1. vlastnosti ktore sme prebrali z inych projektov:
            - zaznamenanie si objektu na mape do databazy
            - objekty zoskupit do skupiny
            - moznost editacie (ikonka markeru na mape, poznamky objektu, zmena mena objektu)
        2. vlastnoti ktore budu pridane v projekte :
        - vytvorenie rozumnych filtrov pre vyhladavanie objektov, ktore splnuju specificke vlastnoti (typ, lokacia, vlastnosti)
        - manazovanie kolekcii s objektamy, dynamicke ziskavanie informacii o danom objekte (obrazok, link na clanok o objekte, vlastnosti/detaily objektu)
    Ciele prace
        - zoznam use-case-ov ktore ocakavame od nasej aplikaci
        - navrh, implementacia use-case-ov a otestovanie

Informacie dobre poznat
    RDF 
        - popis RDF formatu
    Sparql 
        - popis Sparql jazyka

Analyza poziadaviek
    uzivatelske potreby
        - zamyslenie sa co by som chcel od aplikacie, navrhy znamych
    uzivatelske pouzitia ktore boli zamiatnute
        - vymenovanie zopar napadov a nasledne uvedenie dovodu preco som ich nerobil
        - pouzivame iba dnesne existujuce uzemia (WIkidata dovod)
        - vyhladavanie je omedzene .. nevieme spajat vyhladavacie dotazy (dlzka query je pri vysoka)
            -> riesenie .. neskorsia editacia pomocou mergovania kolekcii
Analyza Wikidata ako datove zdroje
    Vyber wikidata
        - rada/navrh od veduceho 
        - preskumanie Wikidata -> spokojnost 
    Wikidata
        - ako funguju, ako tam vieme ziskat data
        Objekt
            - analyza co definuje nas objekt ktory vieme navstivit
            - ake data su potrebne
        Vlastnosti objektov
            - ako funguju
            datove typy
                - ake tam najdeme datove typy
                - ktore sme si vybrali ze budeme podporovat a preco
        Wikidata sparql query 
            - co to je
            Problemy
                - ked nieco nedobehne do 60 sekund tak sa to ukonci
        Ziskanie udajov o objekte
            Zakladne
                -QNUmber, meno, popis, suradnice, akeho typu je (zoznam akych tried je objekt instanciou)
            Rozsirene
                - obrazok
                Detaily 
                    Item
                    Quantity
                        - unit
                    Time
                        - precision
                Wikipedia link
        Vyhladavanie dat
            Povodny napad
                - ako som zamyslal vyhladavat veci na wikidatach pomocou nazvu
            Problem
                - velmi pomale , cakame aj 20 sekund
            Optimalizacia
                sluzba MWAPI 
                    - co to je a ako funguje
                    - ako sme to vyuzili my
        Vyhladavanie vyhovujucich objektov
            - popis
            Definovanie katogerie/typu
                - co to znamena a preco to budeme pouzivat (chceme vyhladavat hrady,jaskyne, mesta)
                - Pododny napad
                    - staticke vymenovanie
                    - preco je to zle
                - Dynamicke riesenie
                    - ako to funguje 
                    - ako sme vymysleli vyhladavanie tychto moznych kategorii
            Definovanie lokacie
                - preco to chceme spravit
                - napady na rozne typy
                Podla okolia
                    - popis ako to funguje
                    Service Wikibase Around
                        - co to je a ako to funguje
                Podla administrativneho uzemia
                    - ako sme to spravili
                    Vyhladavanie moznych adm. uzemii
                        - ako vyhladavame tieto uzemia
                    Vynimky
                        - vieme definovat ze v tejto lokacii nechceme vyhladavat
                Podla regionu
                    Problemy
                        - preco sme zvazovali to tam nedat
                        - je to narocna operacia
                    Ziskanie moznych regionov
                        - ako vyhladavame mozne regiony
                    Optimalizacia
                        - vymyslenie ako to ziskat rychlejsie aby query zbehlo
                Cely svet
                    Problemy a rizika
                    Optimalizacne taktiky
                        - uprava query pre tento typ definovania lokacii
            Filtre
                Povodny napad
                    - ako som si to iba na zaciatku predstavoval
                Finalna podoba
                    - ako to vyzera teraz
                    - mozne filtre
                    All filters
                        - co to znamena a ako ich ziskame
                        Optimaliazia
                            - ulozenie dat, aby sa stale nemuseli neustale pre kazde vyhladavanie ziskavat
                    Recomended filters
                        - popis co to znamena a ako ich ziskame
                    Typy filtrov podla datovej hodnoty
                        WikibaseItem
                            Constains 
                                - co to znamena pre vyhladavanie moznych hodnot pre dany filter
                        Time
                            Precision
                                - co to znamena a ako sme to vyriesili
                        Quantity
                            -max and min
                            Units
                                - rozne jednotky vyjadrenia hodnoty
Navrh architektury
    Server
    Frontend
    DatabaseAPI 
    WikidateAPI

Implementacia
    Server
        Python a Flask
            - preco som si to vybral
        Dokumentacia
            Databasa
                - vyber databazy Mysql
                CRUD operacie
                    - ake operacie tam pouzivame
                DatabaseAPI
                    - route metody pre manazovanie databazy
            WikidataAPI
                Querybuilders
                    popis postupne ako sme vytvorili builder ktore vytvaraju query pre wikidata
                    Base Query
                    Search Query
                    ...
                Route methods
            Staticke data
                - json data obsahujuca all filters
        Instalacia a spustenie
    Frontend
        React a typescript
            - preco som si to vybral
            React
                - ako funguje
                Hooks
                    - pouzivanie hookov - novy pristup
            Responsibility
                - ako sa rozne renderuje podla rozlisenia obrazovky
                Limity
                    - ked je menej ako tolko zacne to uz vyzerat velmi zle, prehlasenie ze to nieje podporovane
        Dokumentacia
            Datove modely
                - rozpis datovych modelov ako Collection a Collectible
            React Komponenty
                - popis vsetkych komponentov
        Instalacia

Uzivatelske rozhranie
    - ako vyzera stranka
    Tuturial 
        - ako pouzivat stranku
        Priklady pre vyhladavanie niejakych objektov

Testovanie
    - ukazanie ako by sme testovali stranku
    Playwright
        - co to je a ako funguje
        Ukazka testov

Zaver
    - zaver, zhrnutie
    Co by sa dalo dorobit
        Zaznamenovanie Uzemia
            - nemusime len boddy ale vieme aj uzemia si pamatat
            - vyuzitie ako strieracia mapa
        Zlepsenie UI pre uzivatela stranky
            - priznanie ze UI nevyzera svetoborne

Citacie










