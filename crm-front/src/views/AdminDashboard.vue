<template>
	<div class="admin-dashboard">
		<div class="admin-header">
			<h1>Tableau de bord administrateur</h1>
		</div>

		<div class="admin-navigation">
			<v-btn
				@click="activeComponent = 'products'"
				:color="activeComponent === 'products' ? 'primary' : 'grey-lighten-1'"
				:variant="activeComponent === 'products' ? 'elevated' : 'outlined'"
				class="nav-button"
				size="large"
			>
				Produits
			</v-btn>
			<v-btn
				@click="activeComponent = 'categories'"
				:color="activeComponent === 'categories' ? 'primary' : 'grey-lighten-1'"
				:variant="activeComponent === 'categories' ? 'elevated' : 'outlined'"
				class="nav-button"
				size="large"
			>
				Catégories
			</v-btn>
			<v-divider :vertical="!isMobile" :thickness="isMobile ? 3 : 2" />
			<v-btn
				@click="activeComponent = 'users'"
				:color="activeComponent === 'users' ? 'primary' : 'grey-lighten-1'"
				:variant="activeComponent === 'users' ? 'elevated' : 'outlined'"
				class="nav-button"
				size="large"
			>
				Utilisateurs
			</v-btn>
			<v-btn
				@click="activeComponent = 'orders'"
				:color="activeComponent === 'orders' ? 'primary' : 'grey-lighten-1'"
				:variant="activeComponent === 'orders' ? 'elevated' : 'outlined'"
				class="nav-button"
				size="large"
			>
				Commandes
			</v-btn>
		</div>

		<div class="admin-content">
			<component :is="currentComponent" />
		</div>
	</div>
</template>

<script lang="ts">
	import AdminCategories from "@/components/AdminCategories.vue";
	import AdminOrders from "@/components/AdminOrders.vue";
	import AdminProducts from "@/components/AdminProducts.vue";
	import AdminUsers from "@/components/AdminUsers.vue";
	import { defineComponent, ref, onMounted, onUnmounted } from "vue";

	export default defineComponent({
		name: "AdminDashboard",
		components: {
			AdminProducts,
			AdminCategories,
			AdminUsers,
			AdminOrders,
		},
		setup() {
			const isMobile = ref(window.innerWidth <= 768);
			const handleResize = () => {
				isMobile.value = window.innerWidth <= 768;
			};
			onMounted(() => {
				window.addEventListener("resize", handleResize);
			});
			onUnmounted(() => {
				window.removeEventListener("resize", handleResize);
			});
			return { isMobile };
		},
		data() {
			return {
				activeComponent: "users" as string,
			};
		},
		computed: {
			currentComponent() {
				switch (this.activeComponent) {
					case "users":
						return "AdminUsers";
					case "products":
						return "AdminProducts";
					case "categories":
						return "AdminCategories";
					case "orders":
						return "AdminOrders";
					default:
						return "AdminUsers";
				}
			},
		},
	});
</script>

<style scoped>
	.admin-dashboard {
		padding: 20px;
		max-width: 1200px;
		margin: 0 auto;
	}

	.admin-header {
		text-align: center;
		margin-bottom: 30px;
	}

	.admin-header h1 {
		color: #2c3e50;
		font-size: 2.5rem;
		margin: 0;
	}

	.admin-navigation {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		margin-bottom: 30px;
	}
	.admin-nav-group {
		display: flex;
		gap: 15px;
	}
	.admin-nav-separator {
		width: 2px;
		height: 60px;
		background: #e0e0e0;
		border-radius: 2px;
		transition: all 0.3s;
	}

	.nav-button {
		min-width: 150px;
		max-width: 150px;
		width: 150px;
		height: 80px;
		font-size: 16px;
		font-weight: 600;
		text-transform: none;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.admin-content {
		background: white;
		border-radius: 12px;
		padding: 30px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		min-height: 400px;
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.admin-navigation {
			flex-direction: column;
			align-items: stretch;
		}
		.admin-nav-group {
			justify-content: center;
		}
		.admin-nav-separator {
			width: 100%;
			height: 2px;
		}

		.admin-header h1 {
			font-size: 2rem;
		}

		.admin-content {
			padding: 20px;
		}

		.nav-button {
			width: 100%;
			max-width: 200px;
			min-width: 120px;
			height: 60px;
			font-size: 14px;
			margin-left: auto;
			margin-right: auto;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}

	@media (max-width: 480px) {
		.admin-dashboard {
			padding: 10px;
		}

		.admin-header h1 {
			font-size: 1.5rem;
		}

		.nav-button {
			min-width: 120px;
			height: 60px;
			font-size: 14px;
		}
	}
</style>
