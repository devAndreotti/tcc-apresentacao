# Stitch

Apresentacao estatica com cinco telas HTML e uma home de navegacao.

## Rodar

No PowerShell, na raiz do projeto:

```powershell
cd D:\Dev\Projects\Antigravity\project-01\stitch
.\start.ps1
```

Isso sobe um servidor HTTP local e abre:

```text
http://127.0.0.1:8000/index.html
```

## Alternativa manual

```powershell
python -m http.server 8000
```

Depois abra `http://127.0.0.1:8000/index.html`.

## Se o PowerShell reclamar

Voce tambem pode rodar:

```bat
start.cmd
```

Ou, no PowerShell:

```powershell
.\start.ps1 -Port 8001
```

Isso ajuda quando a porta `8000` ja esta ocupada.

## Atalhos

- `H`: volta para a home.
- `1-5`: pula direto para uma tela.
- `←` e `→`: anterior e proxima.
- `F`: alterna fullscreen.
- `?`: abre o mapa de navegacao e atalhos.

## Publicacao

GitHub Pages (via Actions):

```text
https://devAndreotti.github.io/tcc-apresentacao/
```
