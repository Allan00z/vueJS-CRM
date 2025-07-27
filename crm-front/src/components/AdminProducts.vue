<template>
	<div class="admin-products">
		<div class="header-actions">
			<h2>Gestion des produits</h2>
			<v-btn
				color="primary"
				variant="elevated"
				prepend-icon="mdi-plus"
				@click="openAddModal"
			>
				Ajouter un produit
			</v-btn>
		</div>

		<v-card>
			<v-data-table
				:headers="headers"
				:items="products"
				:loading="loading"
				:search="search"
				class="elevation-1"
			>
				<template v-slot:top>
					<v-text-field
						v-model="search"
						label="Rechercher un produit"
						prepend-inner-icon="mdi-magnify"
						variant="outlined"
						density="compact"
						class="mx-4 mt-4"
						style="max-width: 300px"
					></v-text-field>
				</template>

				<template v-slot:item.price="{ item }">
					<span class="font-weight-bold">{{ formatPrice(item.price) }}</span>
				</template>

				<template v-slot:item.category="{ item }">
					<v-chip
						:color="getCategoryColor(item.category.name)"
						variant="tonal"
						size="small"
					>
						{{ item.category.name }}
					</v-chip>
				</template>

				<template v-slot:item.actions="{ item }">
					<v-btn
						icon="mdi-pencil"
						size="small"
						color="primary"
						variant="text"
						@click="editProduct(item)"
						class="mr-2"
					></v-btn>
					<v-btn
						icon="mdi-delete"
						size="small"
						color="error"
						variant="text"
						@click="confirmDelete(item)"
					></v-btn>
				</template>

				<template v-slot:no-data>
					<div class="text-center py-8">
						<v-icon size="64" color="grey-lighten-1"
							>mdi-package-variant</v-icon
						>
						<p class="text-h6 text-grey mt-4">Aucun produit trouvé</p>
						<v-btn
							color="primary"
							variant="outlined"
							@click="openAddModal"
							class="mt-4"
						>
							Ajouter le premier produit
						</v-btn>
					</div>
				</template>
			</v-data-table>
		</v-card>

		<ModalProduct
			v-model="showProductModal"
			:product="selectedProduct"
			:categories="categories"
			:loading="modalLoading"
			@save="handleSaveProduct"
		/>

		<ModalDelete
			v-model="showDeleteModal"
			:message="deleteMessage"
			:loading="deleteLoading"
			@confirm="handleDeleteProduct"
		/>

		<v-snackbar v-model="showSnackbar" :color="snackbarColor" :timeout="3000">
			{{ snackbarMessage }}
			<template v-slot:actions>
				<v-btn color="white" variant="text" @click="showSnackbar = false">
					Fermer
				</v-btn>
			</template>
		</v-snackbar>
	</div>
</template>

<script lang="ts">
	import { defineComponent } from "vue";
	import { Product } from "@/assets/types/product";
	import { Category } from "@/assets/types/category";
	import ProductService from "@/services/product.service";
	import CategoryService from "@/services/category.service";
	import ModalProduct from "./ModalProduct.vue";
	import ModalDelete from "./ModalDelete.vue";

	export default defineComponent({
		name: "AdminProducts",
		components: {
			ModalProduct,
			ModalDelete,
		},
		data() {
			return {
				products: [] as Product[],
				categories: [] as Category[],
				loading: false,
				modalLoading: false,
				deleteLoading: false,
				search: "",
				showProductModal: false,
				showDeleteModal: false,
				selectedProduct: null as Product | null,
				productToDelete: null as Product | null,
				showSnackbar: false,
				snackbarMessage: "",
				snackbarColor: "success",
				headers: [
					{ title: "Nom", key: "name", sortable: true },
					{ title: "Prix", key: "price", sortable: true },
					{ title: "Catégorie", key: "category", sortable: true },
					{ title: "Actions", key: "actions", sortable: false, width: "120px" },
				],
			};
		},
		computed: {
			deleteMessage(): string {
				if (this.productToDelete) {
					return `Êtes-vous sûr de vouloir supprimer le produit "${this.productToDelete.name}" ?`;
				}
				return "Êtes-vous sûr de vouloir supprimer ce produit ?";
			},
		},
		async mounted() {
			await this.loadProducts();
			await this.loadCategories();
		},
		methods: {
			async loadProducts() {
				this.loading = true;
				try {
					const response = await ProductService.getAll();
					this.products = response.data;
				} catch (error) {
					console.error("Erreur lors du chargement des produits:", error);
					this.showNotification(
						"Erreur lors du chargement des produits",
						"error"
					);
				} finally {
					this.loading = false;
				}
			},

			async loadCategories() {
				try {
					const response = await CategoryService.getAll();
					this.categories = response.data;
				} catch (error) {
					console.error("Erreur lors du chargement des catégories:", error);
					this.showNotification(
						"Erreur lors du chargement des catégories",
						"error"
					);
				}
			},

			openAddModal() {
				this.selectedProduct = null;
				this.showProductModal = true;
			},

			editProduct(product: Product) {
				this.selectedProduct = product;
				this.showProductModal = true;
			},

			confirmDelete(product: Product) {
				this.productToDelete = product;
				this.showDeleteModal = true;
			},

			async handleSaveProduct(productData: any) {
				this.modalLoading = true;
				try {
					if (productData.id) {
						await ProductService.update(productData.id, productData);
						this.showNotification("Produit modifié avec succès", "success");
					} else {
						await ProductService.create(productData);
						this.showNotification("Produit créé avec succès", "success");
					}

					this.showProductModal = false;
					await this.loadProducts();
				} catch (error) {
					console.error("Erreur lors de la sauvegarde:", error);
					this.showNotification("Erreur lors de la sauvegarde", "error");
				} finally {
					this.modalLoading = false;
				}
			},

			async handleDeleteProduct() {
				if (!this.productToDelete) return;

				this.deleteLoading = true;
				try {
					await ProductService.delete(this.productToDelete.id);
					this.showNotification("Produit supprimé avec succès", "success");
					this.showDeleteModal = false;
					await this.loadProducts();
				} catch (error) {
					console.error("Erreur lors de la suppression:", error);
					this.showNotification("Erreur lors de la suppression", "error");
				} finally {
					this.deleteLoading = false;
					this.productToDelete = null;
				}
			},

			formatPrice(price: number): string {
				return new Intl.NumberFormat("fr-FR", {
					style: "currency",
					currency: "EUR",
				}).format(price);
			},

			getCategoryColor(categoryName: string): string {
				const colors = ["primary", "secondary", "success", "info", "warning"];
				const index = categoryName.length % colors.length;
				return colors[index];
			},

			showNotification(message: string, color: string = "success") {
				this.snackbarMessage = message;
				this.snackbarColor = color;
				this.showSnackbar = true;
			},
		},
	});
</script>

<style scoped>
	.admin-products {
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
