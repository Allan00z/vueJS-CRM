<template>
	<div class="cart-container">
		<h1 class="cart-title">Mon Panier</h1>

		<div v-if="cartItems.length === 0" class="empty-cart">
			<p class="empty-message">Votre panier est vide</p>
			<v-btn color="primary" class="continue-shopping" to="/"
				>Continuer vos achats</v-btn
			>
		</div>

		<div v-else>
			<v-list class="cart-items">
				<div v-for="(item, index) in cartItems" :key="index" class="cart-item">
					<div class="item-info">
						<div class="item-image"></div>
						<div>
							<h3 class="item-name">{{ item.name }}</h3>
							<div class="category-frame">{{ item.category }}</div>
						</div>
					</div>

					<div class="item-actions">
						<div class="quantity-control">
							<v-btn
								v-if="item.quantity > 1"
								icon
								size="small"
								@click="decreaseQuantity(index)"
							>
								<v-icon>mdi-minus</v-icon>
							</v-btn>
							<span class="quantity">{{ item.quantity }}</span>
							<v-btn icon size="small" @click="increaseQuantity(index)">
								<v-icon>mdi-plus</v-icon>
							</v-btn>
						</div>

						<div class="price">
							{{ formatPrice(item.price * item.quantity) }}
						</div>

						<v-btn icon color="error" @click="removeItem(index)">
							<v-icon>mdi-delete</v-icon>
						</v-btn>
					</div>
				</div>
			</v-list>

			<div class="cart-summary">
				<div class="summary-row total">
					<span>Total:</span>
					<span>{{ formatPrice(total) }}</span>
				</div>

				<v-btn
					color="primary"
					block
					class="confirm-btn"
					@click="confirmCommand"
				>
					Confirmer la commande
				</v-btn>
			</div>
		</div>

		<div v-if="showNotification" class="notification" :class="notificationType">
			{{ notificationMessage }}
		</div>
	</div>
</template>

<script lang="ts">
	import { defineComponent, ref, computed } from "vue";
	import { useRouter } from "vue-router";
	import OrderService from "@/services/order.service";
	import AuthService from "@/services/auth.service";
	import { Order } from "@/assets/types/order";

	interface CartItem {
		id: number;
		name: string;
		price: number;
		quantity: number;
		category: string;
	}

	export default defineComponent({
		name: "CartView",
		setup() {
			const router = useRouter();
			const cartItems = ref<CartItem[]>([]);
			const showNotification = ref(false);
			const notificationMessage = ref("");
			const notificationType = ref("success");

			// Load cart from localStorage
			const loadCartFromStorage = () => {
				const cartData = localStorage.getItem("cart");
				if (cartData) {
					try {
						cartItems.value = JSON.parse(cartData);
					} catch (error) {
						console.error("Error parsing cart data from localStorage:", error);
					}
				}
			};

			loadCartFromStorage();

			const total = computed(() => {
				return cartItems.value.reduce(
					(total, item) => total + item.price * item.quantity,
					0
				);
			});

			const formatPrice = (price: number): string => {
				return `${price.toFixed(2)} €`;
			};

			const increaseQuantity = (index: number) => {
				cartItems.value[index].quantity++;
				localStorage.setItem("cart", JSON.stringify(cartItems.value));
			};

			const decreaseQuantity = (index: number) => {
				if (cartItems.value[index].quantity > 1) {
					cartItems.value[index].quantity--;
					localStorage.setItem("cart", JSON.stringify(cartItems.value));
				}
			};

			const removeItem = (index: number) => {
				cartItems.value.splice(index, 1);
				localStorage.setItem("cart", JSON.stringify(cartItems.value));
			};

			const confirmCommand = async () => {
				try {
					const user = AuthService.getCurrentUser();
					if (!user) {
						router.push("/login");
						return;
					}

					const orderData = {
						order: cartItems.value.map((item) => ({
							id: item.id,
							quantity: item.quantity,
						})),
					};

					await OrderService.create(orderData);
					localStorage.removeItem("cart");
					cartItems.value = [];
					showTemporaryMessage("Commande confirmée avec succès!", "success");
				} catch (error) {
					console.error("Erreur lors de la création de la commande:", error);
					showTemporaryMessage(
						"Erreur lors de la confirmation de la commande",
						"error"
					);
				}
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

			return {
				cartItems,
				total,
				formatPrice,
				increaseQuantity,
				decreaseQuantity,
				removeItem,
				confirmCommand,
				showNotification,
				notificationMessage,
				notificationType,
			};
		},
	});
</script>

<style scoped>
	.cart-container {
		padding: 16px;
	}

	.cart-title {
		font-size: 1.5rem;
		font-weight: bold;
		margin-bottom: 24px;
	}

	.empty-cart {
		text-align: center;
		padding: 32px 0;
	}

	.empty-message {
		color: #6b7280;
	}

	.continue-shopping {
		margin-top: 16px;
	}

	.cart-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #e5e7eb;
		padding: 16px 0;
	}

	.item-info {
		display: flex;
		align-items: center;
	}

	.item-image {
		width: 64px;
		height: 64px;
		background-color: #e5e7eb;
		border-radius: 6px;
		margin-right: 16px;
	}

	.item-name {
		font-weight: 500;
	}

	.category-frame {
		background-color: #e3f2fd;
		color: #1976d2;
		padding: 4px 8px;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 500;
		margin-top: 4px;
		display: inline-block;
	}

	.item-actions {
		display: flex;
		align-items: center;
	}

	.quantity-control {
		display: flex;
		align-items: center;
		margin-right: 32px;
	}

	.quantity {
		margin: 0 8px;
	}

	.price {
		margin-right: 32px;
		min-width: 80px;
		text-align: right;
	}

	.cart-summary {
		margin-top: 24px;
		padding: 16px;
		background-color: #f9fafb;
		border-radius: 6px;
	}

	.summary-row {
		display: flex;
		justify-content: space-between;
		margin-bottom: 8px;
	}

	.total {
		font-weight: bold;
		font-size: 1.125rem;
	}

	.confirm-btn {
		margin-top: 16px;
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
