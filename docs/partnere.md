# Partnere til belønningene – salgsark og e-postmaler

For trafikkskoler, treningssentre og bokhandler. Fyll inn det som står i
[hakeparentes] før du sender. Ikke skriv tall du ikke har (antall elever,
skoler) – skriv heller «vi er nye» enn å gjette.

## Kort om tilbudet (én side)

**Studer** er en øvingsapp for elever fra 8. trinn til Vg3: flashcards, quiz,
miniprøver og formelmatch for hvert tema i hvert fag. Elevene tjener poeng når
de øver, og kan bytte poengene i belønninger.

**Det dere får**

- Tilbudet deres vises på belønningssiden til elever som øver jevnlig – unge
  i en alder der mange skal ta førerkort, begynne å trene eller kjøpe
  skolesaker.
- Elevene «jobber» for tilbudet med poeng fra øving. Det er en belønning,
  ikke en reklame de scroller forbi.
- Lav innsats: dere sender en liste med koder, vi gjør resten.
- [Antall aktive elever og skoler, hvis dere har tall. Ellers: «Vi er nye og
  vokser – dere blir blant de første partnerne.»]

**Det vi ber om**

- Et konkret tilbud, for eksempel en gratis prøveuke, en gratis time eller et
  gavekort.
- En liste med unike koder (for eksempel 25–100), og hvor lenge de gjelder.
- Vilkårene som skal stå sammen med tilbudet (for eksempel «gjelder
  [avdeling]», «én per person»).

**Det vi lover**

- Vi deler aldri elevdata med dere – ikke navn, e-post eller skole. Eleven
  får bare koden.
- Tilbudet koster eleven poeng, ikke penger, og vi skriver tydelig hvem som
  står bak.
- Ingen trekninger eller konkurranser om tilbudet – hver kode kjøpes med en
  fast poengsum.
- Vi viser bare tilbud som passer for elever fra 13 år.

## Forslag per bransje

| Bransje | Tilbud som passer | Hvorfor det treffer |
| --- | --- | --- |
| Trafikkskole | Rabatt på trafikalt grunnkurs, eller en gratis kjøretime / teoritime | 15–18-åringene skal snart ta lappen, og velger skole tidlig |
| Treningssenter | Gratis prøveuke, eller første måned rabattert for ungdom | Lav kostnad for senteret, og bra for elevene |
| Bokhandel / skolesaker | Gavekort (for eksempel 100 kr), rabatt på kalkulator eller skolesekk | Naturlig koblet til læring og skolestart |

## E-postmaler

**Trafikkskole**

> Emne: Gratis kjøretimer som belønning for elever som øver
>
> Hei [navn]!
>
> Jeg heter [ditt navn] og driver Studer, en øvingsapp for elever fra
> 8. trinn til Vg3. Elevene tjener poeng når de øver, og kan bytte dem i
> belønninger.
>
> Vi vil gjerne ha med en trafikkskole i [område], for eksempel med [en gratis
> kjøretime / rabatt på trafikalt grunnkurs] som belønning. Dere sender oss en
> liste med koder, og elevene som har øvd mest, kan løse dem inn. Vi deler
> ingen elevdata med dere.
>
> Har du ti minutter til en prat denne eller neste uke?
>
> Hilsen [ditt navn], Studer – [telefon]

**Treningssenter**

> Emne: Gratis prøveuke for ungdom som øver på skolefag
>
> Hei [navn]!
>
> Jeg heter [ditt navn] og driver Studer, en øvingsapp for elever fra
> 8. trinn til Vg3. Elevene tjener poeng når de øver, og kan bytte dem i
> belønninger.
>
> Vi tror en gratis prøveuke hos dere ville vært en fin belønning – den koster
> lite, og dere møter ungdom i [område] som er i gang med noe. Dere sender oss
> en liste med koder, og vi viser tilbudet med deres navn. Vi deler ingen
> elevdata.
>
> Kan vi ta en kort prat om det?
>
> Hilsen [ditt navn], Studer – [telefon]

**Bokhandel**

> Emne: Gavekort som belønning for elever som øver
>
> Hei [navn]!
>
> Jeg heter [ditt navn] og driver Studer, en øvingsapp for elever fra
> 8. trinn til Vg3. Elevene tjener poeng når de øver, og kan bytte dem i
> belønninger.
>
> Vi vil gjerne ha med en bokhandel, for eksempel med [gavekort på 100 kr /
> rabatt på kalkulator] som belønning. Det passer godt sammen med skolearbeid,
> og dere når elever rett før skolestart og eksamen. Dere sender oss koder, og
> vi deler ingen elevdata.
>
> Passer det med en kort prat?
>
> Hilsen [ditt navn], Studer – [telefon]

## Før et tilbud legges inn

- [ ] Skriftlig avtale (e-post holder): tilbud, antall koder, gyldighet,
      vilkår, og at partneren godtar at navnet vises.
- [ ] Tilbudet passer for 13-åringer: ikke usunn mat eller brus, energidrikk,
      snus/vape, alkohol, pengespill, kreditt eller kosmetiske inngrep.
- [ ] Ingen trekning – fast poengpris.
- [ ] Legg inn belønningen og kodene (se nederst i
      `supabase/migrations/20261109120000_konkurranse.sql`):

```sql
insert into public.belonninger (partner, tittel, beskrivelse, vilkar, lenke, poengpris, gyldig_til)
values ('Trafikkskolen AS', 'Gratis kjøretime', 'En kjøretime på 45 minutter.', 'Gjelder [avdeling]. Bestill innen gyldighetsdatoen.', 'https://…', 3000, '2027-06-30')
returning id;

insert into public.kuponger (belonning_id, kode) values ('<id>', 'KODE1'), ('<id>', 'KODE2');
```

Poengpris: en elev som øver hver dag, tjener rundt 50–150 poeng per dag. Et
tilbud verdt et par hundre kroner bør koste flere uker med øving (for
eksempel 3 000–6 000 poeng).
