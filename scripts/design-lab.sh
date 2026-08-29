#!/usr/bin/env bash
# Design Lab helper — a thin wrapper over git and wrangler, nothing more.
# See /design-lab/README.md for the full workflow this supports.
set -euo pipefail

BASELINE="main"
PROD_WORKER_NAME="portfolio-site"
CMD="${1:-}"
ARG="${2:-}"

usage() {
  echo "Usage:"
  echo "  npm run lab:new -- <direction>   Create design-lab/<direction> from $BASELINE"
  echo "  npm run lab:list                 List all design-lab/* branches"
  echo "  npm run lab:status               Show current branch and its diff vs $BASELINE"
  echo "  npm run lab:preview               Deploy the current design-lab/* branch to an isolated Worker preview"
  exit 1
}

case "$CMD" in
  new)
    if [ -z "$ARG" ]; then usage; fi
    BRANCH="design-lab/$ARG"
    if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
      echo "Branch $BRANCH already exists. Switch to it with: git switch $BRANCH" >&2
      exit 1
    fi
    git switch "$BASELINE"
    git pull
    git switch -c "$BRANCH"
    BRIEF="design-lab/directions/$ARG.md"
    TEMPLATE="design-lab/directions/TEMPLATE.md"
    if [ ! -f "$BRIEF" ] && [ -f "$TEMPLATE" ]; then
      cp "$TEMPLATE" "$BRIEF"
      echo "Created $BRIEF from the template — fill in the thesis before touching any UI."
    fi
    echo "On branch $BRANCH, baselined from $BASELINE."
    ;;

  list)
    echo "design-lab/* branches:"
    git branch --list 'design-lab/*' --format='  %(refname:short)   last commit %(committerdate:short)   %(subject)'
    ;;

  status)
    CURRENT="$(git branch --show-current)"
    echo "Current branch: $CURRENT"
    if [[ "$CURRENT" == design-lab/* ]]; then
      echo "Design Lab direction: ${CURRENT#design-lab/}"
      echo ""
      echo "Diff stat vs $BASELINE:"
      git diff "$BASELINE"...HEAD --stat
    else
      echo "Not on a design-lab/* branch."
    fi
    ;;

  preview)
    CURRENT="$(git branch --show-current)"
    if [[ "$CURRENT" != design-lab/* ]]; then
      echo "Refusing: not on a design-lab/* branch (currently on '$CURRENT')." >&2
      echo "This command only deploys isolated lab previews — never production." >&2
      exit 1
    fi
    DIRECTION="${CURRENT#design-lab/}"
    WORKER_NAME="portfolio-site-lab-$DIRECTION"
    if [ "$WORKER_NAME" = "$PROD_WORKER_NAME" ]; then
      echo "Refusing: derived worker name collides with production ('$PROD_WORKER_NAME')." >&2
      exit 1
    fi
    echo "Building and deploying preview Worker: $WORKER_NAME"
    npm run worker:prerender
    npx wrangler deploy --name "$WORKER_NAME"
    echo ""
    echo "Preview deployed as '$WORKER_NAME'."
    echo "Find its *.workers.dev URL in the Cloudflare dashboard under Workers & Pages,"
    echo "or run: npx wrangler deployments list --name $WORKER_NAME"
    echo ""
    echo "This preview is NOT bound to etaylor.co and cannot become production by"
    echo "itself. Promotion is a separate, explicit step: see 'Promoting a winning"
    echo "direction' in /design-lab/README.md."
    ;;

  *)
    usage
    ;;
esac
