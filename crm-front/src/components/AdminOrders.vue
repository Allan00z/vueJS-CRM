<template>
	<div class="admin-commands">
		<div class="header-actions">
			<h2>Gestion des commandes</h2>
		</div>
		<v-card>
			<v-data-table
				:headers="headers"
				:items="orders"
				:loading="loading"
				:search="search"
				class="elevation-1"
			>
				<template v-slot:top>
					<v-text-field
						v-model="search"
						label="Rechercher une commande"
						prepend-inner-icon="mdi-magnify"
						variant="outlined"
						density="compact"
						class="mx-4 mt-4"
						style="max-width: 300px"
					></v-text-field>
				</template>
				<template v-slot:item.user="{ item }">
					{{ item.user?.firstName }} {{ item.user?.lastName }}
				</template>
				<template v-slot:item.totalPrice="{ item }">
					{{ item.totalPrice }} €
				</template>
				<template v-slot:item.createdAt="{ item }">
					{{ formatDate(item.createdAt) }}
				</template>
				<template v-slot:item.actions="{ item }">
					<v-btn
						icon="mdi-eye"
						size="small"
						color="primary"
						variant="text"
						@click="showOrderDetails(item)"
					></v-btn>
				</template>
				<template v-slot:no-data>
					<div class="text-center py-8">
						<v-icon size="64" color="grey-lighten-1">mdi-cart</v-icon>
						<p class="text-h6 text-grey mt-4">Aucune commande trouvée</p>
					</div>
				</template>
			</v-data-table>
		</v-card>
		<ModalOrderDetails v-model="showDetailsModal" :order-id="selectedOrderId" />
	</div>
</template>

<script lang="ts">
	import { defineComponent } from "vue";
	import ModalOrderDetails from "./ModalOrderDetails.vue";
	import orderService from "@/services/order.service";
	import { Order } from "@/assets/types/order";

	export default defineComponent({
		name: "AdminOrders",
		components: { ModalOrderDetails },
		data() {
			return {
				orders: [] as Order[],
				loading: false,
				search: "",
				showDetailsModal: false,
				selectedOrderId: null as number | null,
				headers: [
					{ title: "Utilisateur", key: "user", sortable: false },
					{ title: "Prix total", key: "totalPrice", sortable: true },
					{ title: "Date", key: "createdAt", sortable: true },
					{ title: "Actions", key: "actions", sortable: false, width: "80px" },
				],
			};
		},
		async mounted() {
			await this.loadOrders();
		},
		methods: {
			async loadOrders() {
				this.loading = true;
				try {
					const response = await orderService.getAll();
					this.orders = response.data;
				} catch (error) {
					console.error("Erreur lors du chargement des commandes:", error);
				} finally {
					this.loading = false;
				}
			},
			showOrderDetails(order: Order) {
				this.selectedOrderId = order.id;
				this.showDetailsModal = true;
			},
			formatDate(date: string) {
				if (!date) return "";
				const d = new Date(date);
				return d.toLocaleDateString("fr-FR");
			},
		},
	});
</script>

<style scoped>
	.admin-commands {
		padding: 20px;
	}
	.header-actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24px;
		flex-wrap: wrap;
		gap: 16px;
	}
	.header-actions h2 {
		margin: 0;
		color: #2c3e50;
	}
	@media (max-width: 768px) {
		.header-actions {
			flex-direction: column;
			align-items: stretch;
		}
		.header-actions h2 {
			text-align: center;
		}
	}
</style>
