# Minecraft AFK Botai (su Discord valdymu)

Šis projektas leidžia paleisti kelias Minecraft AFK paskyras (cracked) ir valdyti jas per Discord komandų pagalba.

### Pagrindinės funkcijos:
- Auto reconnect po kick/disconnect
- Šokinėjimas kas 20 minučių (anti-AFK)
- Discord slash komandos: `/join`, `/leave`, `/status`
- Vienas Discord botas valdo kelis Minecraft altus

---

## Naudojimas

### 1. Konfigūracijos failas

Redaguok `config.json`:

```
{
  "discordToken": "TAVO_DISCORD_BOT_TOKEN",
  "server": {
    "host": "serverio.adresas.lt",
    "port": 25565
  },
  "bots": ["RandomSmile", "Lasagney", "DayN"]
}
```

### 2. Įkėlimas į Render.com

1. Nueik į [https://render.com/](https://render.com/)
2. Prisijunk su GitHub arba Email
3. Sukurk naują Web Service projektą ir pasirink šį projektą
4. Pasirink "Node" kaip runtime
5. Set `Start Command` į: `node index.js`
6. Deploy

---

**Sėkmės AFK'inant!**