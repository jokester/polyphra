PYTHON_BIN ?= python3.12
CONDA_ENV ?= polyphra-py312
CONDA_YML ?= conda.yaml

dev-server: deps
	venv/bin/fastapi dev server.py
deps: venv/.deps_installed

venv/.deps_installed: venv requirements.txt
	venv/bin/pip install -r requirements.txt
	@echo "deps installed"
	@touch $@

upgrade-deps:
	venv/bin/pur -r requirements.txt --skip=$(FREEZE_PY_REQ)

test:
	venv/bin/pytest

format:
	venv/bin/ruff format server.py packages/server

venv: .venv_created


.venv_created: .conda_env_created Makefile
	micromamba run --attach '' -n $(CONDA_ENV) $(PYTHON_BIN) -mvenv --system-site-packages ./venv
	@touch $@

.conda_env_created: $(CONDA_YML)
	# setup conda environment AND env-wise deps
	micromamba env create -n $(CONDA_ENV) --yes -f $(CONDA_YML)
	@touch $@
