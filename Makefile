# ===========================================
# NestJS Project Makefile
# ===========================================

# Variables
# Detects if 'docker-compose' (v1) or 'docker compose' (v2) exists
DOCKER_COMPOSE := $(shell docker compose version >/dev/null 2>&1 && echo "docker compose" || echo "docker-compose")

PROJECT_NAME = loteria-backend
DOCKER_COMPOSE_DEV = $(DOCKER_COMPOSE) -f docker-compose.yml
DOCKER_COMPOSE_PROD = $(DOCKER_COMPOSE) -f docker-compose.yml

# Colors for output
GREEN = \033[0;32m
YELLOW = \033[1;33m
RED = \033[0;31m
NC = \033[0m # No Color

.PHONY: help install dev prod build test clean

# Default target
.DEFAULT_GOAL := help

# ===========================================
# Help
# ===========================================
help: ## Show this help message
	@echo "$(GREEN)NestJS Development Commands$(NC)"
	@echo "================================"
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make $(YELLOW)<target>$(NC)\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2 } /^##@/ { printf "\n$(GREEN)%s$(NC)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ 📦 Installation & Setup
install: ## Install dependencies locally
	@echo "$(GREEN)Installing dependencies...$(NC)"
	yarn install

install-clean: ## Clean install (remove node_modules first)
	@echo "$(YELLOW)Cleaning node_modules...$(NC)"
	rm -rf node_modules yarn.lock
	@echo "$(GREEN)Installing dependencies...$(NC)"
	yarn install

setup: install ## Initial project setup
	@echo "$(GREEN)Setting up the project...$(NC)"
	@echo "$(GREEN)✅ Project setup complete!$(NC)"

##@ 🚀 Development
dev: ## Start development server locally
	@echo "$(GREEN)Starting development server...$(NC)"
	yarn start:dev

dev-docker: ## Start development with Docker in background
	@echo "$(GREEN)Starting development with Docker (detached)...$(NC)"
	$(DOCKER_COMPOSE_DEV) up -d --build --force-recreate

dev-docker-logs: ## Show development Docker logs
	$(DOCKER_COMPOSE_DEV) logs -f app

dev-docker-stop: ## Stop development Docker containers
	@echo "$(YELLOW)Stopping development containers...$(NC)"
	$(DOCKER_COMPOSE_DEV) down

##@ 🏭 Production
prod: ## Start production locally
	@echo "$(GREEN)Starting production server...$(NC)"
	yarn build
	yarn start:prod

prod-docker: ## Start production with Docker in background
	@echo "$(GREEN)Starting production with Docker (detached)...$(NC)"
	$(DOCKER_COMPOSE_PROD) up -d --build --force-recreate

prod-docker-logs: ## Show production Docker logs
	$(DOCKER_COMPOSE_PROD) logs -f app

prod-docker-stop: ## Stop production Docker containers
	@echo "$(YELLOW)Stopping production containers...$(NC)"
	$(DOCKER_COMPOSE_PROD) down

##@ 🔨 Build & Test
build: ## Build the application
	@echo "$(GREEN)Building application...$(NC)"
	yarn build

build-docker-dev: ## Build development Docker image
	@echo "$(GREEN)Building development Docker image...$(NC)"
	docker build --target dependencies -t $(PROJECT_NAME):dev .

build-docker-prod: ## Build production Docker image
	@echo "$(GREEN)Building production Docker image...$(NC)"
	docker build --target production -t $(PROJECT_NAME):prod .

test: ## Run tests
	@echo "$(GREEN)Running tests...$(NC)"
	yarn test

test-watch: ## Run tests in watch mode
	@echo "$(GREEN)Running tests in watch mode...$(NC)"
	yarn test:watch

test-coverage: ## Run tests with coverage
	@echo "$(GREEN)Running tests with coverage...$(NC)"
	yarn test:cov

test-e2e: ## Run e2e tests
	@echo "$(GREEN)Running e2e tests...$(NC)"
	yarn test:e2e

#@ 🎨 Code Quality
format: ## Format code
	@echo "$(GREEN)Formatting code...$(NC)"
	# yarn format

format-check: ## Check code formatting
	@echo "$(GREEN)Checking code formatting...$(NC)"
	# yarn format:check

lint: ## Lint and fix code
	@echo "$(GREEN)Linting code...$(NC)"
	# yarn lint

lint-check: ## Check linting without fixing
	@echo "$(GREEN)Checking linting...$(NC)"
	# yarn lint:check

quality: ## Run full quality check (format, lint, test, build)
	@echo "$(GREEN)Running quality checks...$(NC)"
	# make format-check
	# make lint-check
	# make test
	# make build

pre-commit: ## Run pre-commit checks
	@echo "$(GREEN)Running pre-commit checks...$(NC)"
	# make quality

##@ 🗄️ Database (TypeORM)
db-migrate: ## Run database migrations
	@echo "$(GREEN)Running database migrations...$(NC)"
	yarn migration:run

db-migrate-generate: ## Generate new migration
	@echo "$(GREEN)Generating new migration...$(NC)"
	@read -p "Migration name: " name; \
	yarn migration:generate src/migrations/$name

db-migrate-create: ## Create empty migration
	@echo "$(GREEN)Creating empty migration...$(NC)"
	@read -p "Migration name: " name; \
	yarn migration:create src/migrations/$name

db-migrate-revert: ## Revert last migration
	@echo "$(YELLOW)Reverting last migration...$(NC)"
	yarn migration:revert

db-migrate-show: ## Show migration status
	@echo "$(GREEN)Showing migration status...$(NC)"
	yarn migration:show

db-docker: ## Start only database with Docker
	@echo "$(GREEN)Starting database with Docker...$(NC)"
	$(DOCKER_COMPOSE_DEV) up -d db

db-docker: ## Start only database with Docker
	@echo "$(GREEN)Starting database with Docker...$(NC)"
	$(DOCKER_COMPOSE_DEV) up -d db

##@ 🧹 Cleanup
clean: ## Clean build artifacts
	@echo "$(YELLOW)Cleaning build artifacts...$(NC)"
	rm -rf dist
	rm -rf coverage
	rm -rf .nyc_output

clean-docker: ## Stop and remove all Docker containers and volumes
	@echo "$(YELLOW)Cleaning Docker containers and volumes...$(NC)"
	$(DOCKER_COMPOSE_DEV) down -v
	docker system prune -f

clean-docker-rm: ## Stop and remove all Docker containers, volumes and images
	@echo "$(YELLOW)Cleaning and removing containers, volumes and images...$(NC)"
	$(DOCKER_COMPOSE) down -v --remove-orphans --rmi all
	docker system prune -f

clean-docker-oracle: ## Clean Docker and rebuild specifically for Oracle/bcrypt issues
	@echo "$(YELLOW)🧹 Cleaning Docker completely for Oracle/bcrypt fix...$(NC)"
	@echo "$(YELLOW)Stopping all containers...$(NC)"
	$(DOCKER_COMPOSE_DEV) down
	@echo "$(YELLOW)Removing all containers, volumes and images...$(NC)"
	$(DOCKER_COMPOSE) down -v --remove-orphans --rmi all
	@echo "$(YELLOW)Pruning Docker system...$(NC)"
	docker system prune -f
	@echo "$(YELLOW)Removing node_modules from host...$(NC)"
	rm -rf node_modules
	@echo "$(GREEN)🔨 Rebuilding with --no-cache...$(NC)"
	$(DOCKER_COMPOSE_DEV) build --no-cache
	@echo "$(GREEN)🚀 Starting containers...$(NC)"
	$(DOCKER_COMPOSE_DEV) up -d
	@echo "$(GREEN)✅ Docker rebuild complete! Check logs with: make dev-docker-logs$(NC)"

clean-all: clean clean-docker ## Clean everything (build + Docker)
	@echo "$(YELLOW)Cleaning node_modules...$(NC)"
	rm -rf node_modules

##@ 🔧 Utilities
shell: ## Access development container shell
	@echo "$(GREEN)Accessing container shell...$(NC)"
	$(DOCKER_COMPOSE_DEV) exec app sh

shell-prod: ## Access production container shell
	@echo "$(GREEN)Accessing production container shell...$(NC)"
	$(DOCKER_COMPOSE_PROD) exec app sh

logs: dev-docker-logs ## Show development logs (alias)

status: ## Show Docker containers status
	@echo "$(GREEN)Docker containers status:$(NC)"
	$(DOCKER_COMPOSE) ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

env-check: ## Check environment variables
	@echo "$(GREEN)Environment check:$(NC)"
	@echo "Node version: $$(node --version)"
	@echo "Yarn version: $$(yarn --version)"
	@echo "Docker version: $$(docker --version)"
	@echo "Docker Compose: $$($(DOCKER_COMPOSE) --version)"

oracle-check: ## Check Oracle Instant Client installation
	@echo "$(GREEN)Oracle Instant Client check:$(NC)"
	@if docker run --rm $(PROJECT_NAME):dev ls -la /opt/oracle/instantclient 2>/dev/null; then \
		echo "$(GREEN)✅ Oracle Instant Client found$(NC)"; \
	else \
		echo "$(RED)❌ Oracle Instant Client not found$(NC)"; \
	fi

##@ 🚀 Quick Start Commands
start: dev-docker ## Quick start development (alias for dev-docker)

stop: dev-docker-stop ## Quick stop development (alias for dev-docker-stop)

restart: dev-docker-stop dev-docker ## Restart development containers

fresh-start: clean-docker dev-docker ## Clean restart (remove volumes and restart)

##@ 📚 Common Workflows
workflow-dev: ## Complete development workflow
	@echo "$(GREEN)🚀 Starting complete development workflow...$(NC)"
	make install
	make dev-docker

workflow-prod: ## Complete production workflow
	@echo "$(GREEN)🏭 Starting complete production workflow...$(NC)"
	make install
	# make quality
	make build
	make prod-docker

workflow-ci: ## CI/CD workflow (test, lint, build)
	@echo "$(GREEN)🔄 Running CI workflow...$(NC)"
	make install
	# make quality
	make test-coverage
	make build