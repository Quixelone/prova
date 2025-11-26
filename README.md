
# Finanza Creativa - Piattaforma Trading Opzioni BTC

Piattaforma professionale per la gestione di strategie "Wheel" su Bitcoin, con tracciamento PAC, calcolo interesse composto e integrazione API (Pionex).

## 🔗 Repository Ufficiale
**GitHub:** [https://github.com/Quixelone/FinanzaCreativa](https://github.com/Quixelone/FinanzaCreativa)

## Stack Tecnologico

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Charts**: Recharts
- **Icons**: Lucide React

## Funzionalità Principali

- **Dashboard**: Overview portafoglio, proiezioni interesse composto.
- **Strategy Builder**: Creazione guidata strategie con calcolo ROI.
- **Trading Journal**: Registro operazioni con calcolo automatico rendimenti.
- **Garanzia**: Sistema di tracking bonus per rendimenti minimi garantiti (0.10% daily).
- **Bot Telegram**: Generatore segnali con analisi volatilità (IV) e trend.
- **Integrazione Pionex**: Importazione storico ordini e verifica prezzi live.

## Guida Deploy (Produzione)

Il progetto è ottimizzato per **Vercel** o **Netlify**.

### Metodo 1: GitHub (Consigliato)
1. Carica i file su GitHub.
2. Collega il repository a Vercel.
3. Il deploy partirà automaticamente.

### Metodo 2: Build Manuale
Se vuoi caricare manualmente la cartella `dist`:

```bash
npm install
npm run build
# La cartella 'dist' è pronta per l'upload
```

## Configurazione Supabase
Le chiavi API devono essere configurate in `lib/supabase.ts` o tramite variabili d'ambiente per la produzione.
