<template>
	<div class="admin-categories">
		<div class="header-actions">
			<h2>Gestion des catégories</h2>
			<v-btn
				color="primary"
				variant="elevated"
				prepend-icon="mdi-plus"
				@click="openAddModal"
			>
				Ajouter une catégorie
			</v-btn>
		</div>

		<v-card>
			<v-data-table
				:headers="headers"
				:items="categories"
				:loading="loading"
				:search="search"
				class="elevation-1"
			>
				<template v-slot:top>
					<v-text-field
						v-model="search"
						label="Rechercher une catégorie"
						prepend-inner-icon="mdi-magnify"
						variant="outlined"
						density="compact"
						class="mx-4 mt-4"
						style="max-width: 300px"
					></v-text-field>
				</template>

				<template v-slot:item.products="{ item }">
					<v-chip color="info" variant="tonal" size="small">
						{{ item?._count?.products || 0 }} produit(s)
					</v-chip>
				</template>

				<template v-slot:item.actions="{ item }">
					<v-btn
						icon="mdi-pencil"
						size="small"
						color="primary"
						variant="text"
						@click="editCategory(item)"
						class="mr-2"
					></v-btn>
					<v-btn
						icon="mdi-delete"
						size="small"
						color="error"
						variant="text"
						@click="confirmDelete(item)"
						:disabled="item?._count ? item?._count.products > 0 : false"
					></v-btn>
				</template>

				<template v-slot:no-data>
					<div class="text-center py-8">
						<v-icon size="64" color="grey-lighten-1">mdi-tag-multiple</v-icon>
						<p class="text-h6 text-grey mt-4">Aucune catégorie trouvée</p>
						<v-btn
							color="primary"
							variant="outlined"
							@click="openAddModal"
							class="mt-4"
						>
							Ajouter la première catégorie
						</v-btn>
					</div>
				</template>
			</v-data-table>
		</v-card>

		<ModalCategory
			v-model="showCategoryModal"
			:category="selectedCategory"
			:loading="modalLoading"
			@save="handleSaveCategory"
		/>

		<ModalDelete
			v-model="showDeleteModal"
			:message="deleteMessage"
			:loading="deleteLoading"
			@confirm="handleDeleteCategory"
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
	import { Category } from "@/assets/types/category";
	import CategoryService from "@/services/category.service";
	import ModalCategory from "./ModalCategory.vue";
	import ModalDelete from "./ModalDelete.vue";

	export default defineComponent({
		name: "AdminCategories",
		components: {
			ModalCategory,
			ModalDelete,
		},
		data() {
			return {
				categories: [] as Category[],
				loading: false,
				modalLoading: false,
				deleteLoading: false,
				search: "",
				showCategoryModal: false,
				showDeleteModal: false,
				selectedCategory: null as Category | null,
				categoryToDelete: null as Category | null,
				showSnackbar: false,
				snackbarMessage: "",
				snackbarColor: "success",
				headers: [
					{ title: "Nom", key: "name", sortable: true },
					{ title: "Nombre de produits", key: "products", sortable: false },
					{ title: "Actions", key: "actions", sortable: false, width: "120px" },
				],
			};
		},
		computed: {
			deleteMessage(): string {
				if (this.categoryToDelete) {
					if (
						this.categoryToDelete?._count &&
						this.categoryToDelete?._count.products > 0
					) {
						return `Impossible de supprimer la catégorie "${this.categoryToDelete.name}" car elle contient des produits.`;
					}
					return `Êtes-vous sûr de vouloir supprimer la catégorie "${this.categoryToDelete.name}" ?`;
				}
				return "Êtes-vous sûr de vouloir supprimer cette catégorie ?";
			},
		},
		async mounted() {
			await this.loadCategories();
		},
		methods: {
			async loadCategories() {
				this.loading = true;
				try {
					const response = await CategoryService.getAll();
					this.categories = response.data;
				} catch (error) {
					console.error("Erreur lors du chargement des catégories:", error);
					this.showNotification(
						"Erreur lors du chargement des catégories",
						"error"
					);
				} finally {
					this.loading = false;
				}
			},

			openAddModal() {
				this.selectedCategory = null;
				this.showCategoryModal = true;
			},

			editCategory(category: Category) {
				this.selectedCategory = category;
				this.showCategoryModal = true;
			},

			confirmDelete(category: Category) {
				this.categoryToDelete = category;
				this.showDeleteModal = true;
			},

			async handleSaveCategory(categoryData: any) {
				this.modalLoading = true;
				try {
					if (categoryData.id) {
						// Modification
						await CategoryService.update(categoryData.id, categoryData);
						this.showNotification("Catégorie modifiée avec succès", "success");
					} else {
						// Création
						await CategoryService.create(categoryData);
						this.showNotification("Catégorie créée avec succès", "success");
					}

					this.showCategoryModal = false;
					await this.loadCategories();
				} catch (error) {
					console.error("Erreur lors de la sauvegarde:", error);
					this.showNotification("Erreur lors de la sauvegarde", "error");
				} finally {
					this.modalLoading = false;
				}
			},

			async handleDeleteCategory() {
				if (!this.categoryToDelete) return;

				if (
					this.categoryToDelete?._count &&
					this.categoryToDelete?._count.products > 0
				) {
					this.showNotification(
						"Impossible de supprimer une catégorie contenant des produits",
						"error"
					);
					this.showDeleteModal = false;
					this.categoryToDelete = null;
					return;
				}

				this.deleteLoading = true;
				try {
					await CategoryService.delete(this.categoryToDelete.id);
					this.showNotification("Catégorie supprimée avec succès", "success");
					this.showDeleteModal = false;
					await this.loadCategories();
				} catch (error) {
					console.error("Erreur lors de la suppression:", error);
					this.showNotification("Erreur lors de la suppression", "error");
				} finally {
					this.deleteLoading = false;
					this.categoryToDelete = null;
				}
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
	.admin-categories {
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
