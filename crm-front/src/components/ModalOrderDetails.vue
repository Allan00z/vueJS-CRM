<template>
	<v-dialog v-model="modelValue" max-width="700">
		<v-card>
			<v-card-title>Détails de la commande</v-card-title>
			<v-card-text>
				<div v-if="loading" class="text-center py-8">
					<v-progress-circular indeterminate color="primary" />
				</div>
				<div v-else-if="order">
					<div class="order-detail-row">
						<span class="label">Date :</span>
						<span>{{ formatDate(order.createdAt) }}</span>
					</div>
					<div class="order-detail-row">
						<span class="label">Prix total :</span>
						<span>{{ order.totalPrice }} €</span>
					</div>
					<v-divider class="my-4" />
					<div>
						<h3>Produits</h3>
						<v-table density="compact">
							<thead>
								<tr>
									<th>Nom</th>
									<th>Catégorie</th>
									<th>Quantité</th>
									<th>Prix</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="prod in order.products" :key="prod.id">
									<td>{{ prod.product.name }}</td>
									<td>{{ prod.product.category?.name }}</td>
									<td>{{ prod.quantity }}</td>
									<td>{{ prod.totalPrice }} €</td>
								</tr>
							</tbody>
						</v-table>
					</div>
				</div>
				<div v-else class="text-center py-8">Aucune donnée</div>
			</v-card-text>
			<v-card-actions>
				<v-spacer />
				<v-btn color="primary" text @click="$emit('update:modelValue', false)"
					>Fermer</v-btn
				>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script lang="ts">
	import { defineComponent, ref, watch } from "vue";
	import orderService from "@/services/order.service";

	export default defineComponent({
		name: "ModalOrderDetails",
		props: {
			modelValue: {
				type: Boolean,
				required: true,
			},
			orderId: {
				type: [Number, null],
				default: null,
			},
		},
		setup(props) {
			const order = ref<any>(null);
			const loading = ref(false);

			async function fetchOrder() {
				if (!props.orderId) return;
				loading.value = true;
				try {
					const response = await orderService.getOne(props.orderId);
					order.value = response.data;
				} catch (e) {
					order.value = null;
				} finally {
					loading.value = false;
				}
			}

			watch(
				() => [props.modelValue, props.orderId],
				([open, id]) => {
					if (open && id) fetchOrder();
					if (!open) order.value = null;
				}
			);

			function formatDate(date: string | Date) {
				if (!date) return "N/A";
				const d = new Date(date);
				return d.toLocaleDateString("fr-FR", {
					year: "numeric",
					month: "long",
					day: "numeric",
					hour: "2-digit",
					minute: "2-digit",
				});
			}

			return { order, loading, formatDate };
		},
	});
</script>

<style scoped>
	.order-detail-row {
		display: flex;
		justify-content: space-between;
		margin-bottom: 12px;
	}
	.label {
		font-weight: bold;
	}
</style>
