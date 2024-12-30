Conceptueel – enkele verduidelijkingen:
Data management
Zorg ervoor dat je data kunt opslaan. Bewerk, valideer, filter en corrigeer deze waar nodig binnen je applicatie of API. Verifieer bijvoorbeeld of er dubbels aanwezig zijn in de database.
Daarnaast zorg je er best voor dat meerdere mensen van je applicatie gebruik kunnen maken (bijvoorbeeld geen player stats opslaan zonder een player ID, etc). Zorg voor endpoints die data aggregeren, analyseren, etc.

Re-usability van code
Denk na over de herbruikbaarheid van je code. Schrijf abstracte code waar mogelijk en plaats deze in aparte functies of modules.

Code-organisatie
Splits je code op in logische onderdelen. Werk liever met meerdere overzichtelijke bestanden dan met één groot bestand.

Dataflow-documentatie
Documenteer de flow van data in een apart bestand. Gebruik hierbij visuele hulpmiddelen zoals flowcharts om de documentatie te versterken.

Projectdocumentatie
Zorg ervoor dat alle belangrijke documenten – zoals contribution guidelines, code of conduct, changelog, README en license – nu al aanwezig zijn in aparte bestanden. Het ontbreken hiervan kan punten kosten.

README
Schrijf je README zodanig dat andere ontwikkelaars ermee aan de slag kunnen. Vermijd dat je deze uitsluitend voor eindgebruikers opstelt. Documenteer ook je denkwijzen en keuzes.

Assumpties vermijden
Ga er niet van uit dat ik aannames zal doen. Documenteer expliciet de beslissingen en concepten die je hebt toegepast.

Gebruik AI slim
Maak efficiënt gebruik van AI, bijvoorbeeld voor het documenteren van keuzes, het schrijven van commitberichten of het valideren van je code. Vraag bijvoorbeeld hoe je de SOLID-principes beter kunt toepassen of hoe je je code kunt verbeteren.

Kwaliteit boven kwantiteit
Liever minder, maar kwalitatieve code dan veel code van lage kwaliteit of zonder conventies.

Rubrics-check
Controleer vóór indiening alle rubrics kritisch en zorg dat je overal aan voldoet. Vraag elkaar om feedback als je twijfelt.

Stel vragen
Bij onzekerheden kun je me altijd contacteren. Houd je vragen echter kort, duidelijk en concreet, aangezien ik tijdens de vakantie niet altijd even goed bereikbaar ben.

Naast voorafgaande stappen, hieronder nog een soort plan van aanpak per functionaliteit. Volg deze stappen en zorg dat ze zichtbaar zijn in je commits:

Maak een branch aan
Gebruik een duidelijke naam (bijvoorbeeld feature/...).

Kies en documenteer een design pattern
Beschrijf het in de documentatie. Het is absoluut toegestaan een /docs map aan te maken in je repo om hierin te beschrijven welke patronen je koos en waarom, maar evengoed files te te voegen voor andere verduidelijkingen (mappenstructuur etc). Verwijs hiernaar vanuit je readme.

Develop de feature
Ontwikkel de functionaliteit met aandacht voor de SOLID-principes.

Commit regelmatig
Zorg voor korte, overzichtelijke commits en volg de conventies rond Conventional Commits.

Houd conventies aan
Gebruik consistente naamgeving voor variabelen, bestanden en folderstructuren.

Documenteer je code
Documenteer op functieniveau, klasseniveau en applicatieniveau. Gebruik hiervoor een docs: commit.

Voer een cleanup uit
Verwerk verbeteringen en opruimwerkzaamheden in een refactor: commit.

Rebase
Maak gebruik van de rebase feature om "fix" commits weg te werken. Zorg er hiertijdens ook voor dat alle commits de conventional guidelines volgen.
Markdown-documentatie
Documenteer je proces en stappen in Markdown-bestanden.

Merge de branch
Gebruik idealiter een pull request op GitHub om de branch samen te voegen.

Door voor alle features deze stappen te volgen, dek je al een groot deel van de rubrics.

Verdere uitwerking op vlak van design, complexiteit en diepgang kan extra punten opleveren volgens de European grading scale.