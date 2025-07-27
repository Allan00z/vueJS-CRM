<template>
	<div class="profile-container">
		<div class="profile-header">
			<h1>Mon Profil</h1>
		</div>

		<div class="profile-section">
			<h2>Informations personnelles</h2>
			<form @submit.prevent="updateProfile" class="profile-form">
				<div class="form-group">
					<label for="firstName">Prénom:</label>
					<input
						type="text"
						id="firstName"
						v-model="userForm.firstName"
						required
					/>
				</div>
				<div class="form-group">
					<label for="lastName">Nom:</label>
					<input
						type="text"
						id="lastName"
						v-model="userForm.lastName"
						required
					/>
				</div>
				<div class="form-group">
					<label for="email">Email:</label>
					<input type="email" id="email" v-model="userForm.email" required />
				</div>
				<button type="submit" class="btn-primary" :disabled="loading">
					{{ loading ? "Mise à jour..." : "Mettre à jour" }}
				</button>
			</form>
		</div>

		<div class="profile-section">
			<h2>Mes commandes</h2>
			<div v-if="ordersLoading" class="loading">
				Chargement des commandes...
			</div>
			<div v-else class="orders-list">
				<v-card>
					<v-data-table
						:headers="headers"
						:items="orders"
						:loading="loading"
						class="elevation-1"
					>
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
				<ModalOrderDetails
					v-model="showDetailsModal"
					:order-id="selectedOrderId"
				/>
			</div>
		</div>

		<div v-if="showNotification" class="notification" :class="notificationType">
			{{ notificationMessage }}
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted } from "vue";
	import AuthService from "@/services/auth.service";
	import UserService from "@/services/user.service";
	import { Order } from "@/assets/types/order";
	import ModalOrderDetails from "@/components/ModalOrderDetails.vue";

	const userForm = ref({
		firstName: "",
		lastName: "",
		email: "",
	});

	const orders = ref<Order[]>([]);
	const loading = ref(false);
	const ordersLoading = ref(false);
	const showNotification = ref(false);
	const selectedOrderId = ref<undefined | number>(undefined);
	const showDetailsModal = ref(false);
	const notificationMessage = ref("");
	const notificationType = ref("success");
	const headers = ref([
		{ title: "Date", key: "createdAt", sortable: true },
		{ title: "Prix total", key: "totalPrice", sortable: true },
		{ title: "Actions", key: "actions", sortable: false, width: "80px" },
	]);

	const loadUserData = async () => {
		try {
			const user = AuthService.getCurrentUser();
			if (!user) return;

			const response = await UserService.getOne(user.userId || user.id);
			const userData = response.data;
			userForm.value = {
				firstName: userData.firstName || "",
				lastName: userData.lastName || "",
				email: userData.email || "",
			};
			orders.value = userData.orders || [];
		} catch (error) {
			console.error("Error loading profile:", error);
		}
	};

	const updateProfile = async () => {
		loading.value = true;
		try {
			const user = AuthService.getCurrentUser();
			if (!user) return;

			await UserService.update(user.userId || user.id, userForm.value);
			showTemporaryMessage("Profil mis à jour !", "success");
		} catch (error) {
			console.error("Error updating profile:", error);
			showTemporaryMessage("Erreur pendant la mise à jour du profil", "error");
		} finally {
			loading.value = false;
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString();
	};

	const showOrderDetails = (order: Order) => {
		console.log("showOrderDetails", order.id);
		selectedOrderId.value = order.id;
		showDetailsModal.value = true;
	};

	const showTemporaryMessage = (
		message: string,
		type: "success" | "error" = "success"
	) => {
		notificationMessage.value = message;
		notificationType.value = type;
		showNotification.value = true;

		setTimeout(() => {
			showNotification.value = false;
		}, 3000);
	};

	onMounted(() => {
		loadUserData();
	});
</script>

<style scoped>
	.profile-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 20px;
	}

	.profile-header {
		text-align: center;
		margin-bottom: 30px;
	}

	.profile-section {
		background: white;
		border-radius: 8px;
		padding: 20px;
		margin-bottom: 20px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.profile-form {
		max-width: 400px;
	}

	.form-group {
		margin-bottom: 15px;
	}

	.form-group label {
		display: block;
		margin-bottom: 5px;
		font-weight: bold;
	}

	.form-group input {
		width: 100%;
		padding: 8px;
		border: 1px solid #ddd;
		border-radius: 4px;
	}

	.btn-primary {
		background: #007bff;
		color: white;
		padding: 10px 20px;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	.btn-primary:hover {
		background: #0056b3;
	}

	.btn-primary:disabled {
		background: #ccc;
		cursor: not-allowed;
	}

	.orders-list {
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	.order-card {
		border: 1px solid #ddd;
		border-radius: 8px;
		padding: 15px;
	}

	.order-header {
		display: flex;
		justify-content: space-between;
		margin-bottom: 10px;
	}

	.order-id {
		font-weight: bold;
	}

	.order-date {
		color: #666;
	}

	.order-total {
		font-size: 18px;
		font-weight: bold;
		margin-bottom: 10px;
	}

	.order-products {
		border-top: 1px solid #eee;
		padding-top: 10px;
	}

	.product-item {
		padding: 5px 0;
		border-bottom: 1px solid #f5f5f5;
	}

	.loading,
	.no-orders {
		text-align: center;
		padding: 20px;
		color: #666;
	}

	.notification {
		position: fixed;
		bottom: 20px;
		right: 20px;
		padding: 12px 24px;
		border-radius: 4px;
		color: white;
		font-weight: 500;
		z-index: 1000;
		animation: fadeIn 0.3s ease;
	}

	.notification.success {
		background-color: #4caf50;
	}

	.notification.error {
		background-color: #f44336;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
