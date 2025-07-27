<template>
	<v-dialog v-model="dialog" max-width="600" persistent>
		<v-card>
			<v-card-title class="text-h5">
				<v-icon color="primary" class="mr-2">
					{{ isEditing ? "mdi-pencil" : "mdi-plus" }}
				</v-icon>
				{{ isEditing ? "Modifier le produit" : "Ajouter un produit" }}
			</v-card-title>

			<v-card-text>
				<v-form ref="form" v-model="valid">
					<v-row>
						<v-col cols="12">
							<v-text-field
								v-model="productForm.name"
								label="Nom du produit"
								:rules="[rules.required]"
								required
								variant="outlined"
							></v-text-field>
						</v-col>

						<v-col cols="12" md="6">
							<v-text-field
								v-model.number="productForm.price"
								label="Prix"
								type="number"
								:rules="[rules.required, rules.positive]"
								required
								variant="outlined"
								prefix="€"
								step="0.01"
								min="0"
							></v-text-field>
						</v-col>

						<v-col cols="12" md="6">
							<v-select
								v-model="productForm.categoryId"
								:items="categories"
								item-title="name"
								item-value="id"
								label="Catégorie"
								:rules="[rules.required]"
								required
								variant="outlined"
							></v-select>
						</v-col>
					</v-row>
				</v-form>
			</v-card-text>

			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn
					color="grey-darken-1"
					variant="text"
					@click="closeDialog"
					:disabled="loading"
				>
					Annuler
				</v-btn>
				<v-btn
					color="primary"
					variant="elevated"
					@click="saveProduct"
					:loading="loading"
					:disabled="!valid"
				>
					{{ isEditing ? "Modifier" : "Créer" }}
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script lang="ts">
	import { defineComponent } from "vue";
	import { Product } from "@/assets/types/product";
	import { Category } from "@/assets/types/category";

	interface ProductForm {
		name: string;
		price: number;
		categoryId: number | null;
		description: string;
	}

	export default defineComponent({
		name: "ModalProduct",
		props: {
			modelValue: {
				type: Boolean,
				default: false,
			},
			product: {
				type: Object as () => Product | null,
				default: null,
			},
			categories: {
				type: Array as () => Category[],
				default: () => [],
			},
			loading: {
				type: Boolean,
				default: false,
			},
		},
		emits: ["update:modelValue", "save"],
		data() {
			return {
				valid: false,
				productForm: {
					name: "",
					price: 0,
					categoryId: null as number | null,
					description: "",
				} as ProductForm,
				rules: {
					required: (value: any) => !!value || "Ce champ est requis",
					positive: (value: number) => value > 0 || "Le prix doit être positif",
				},
			};
		},
		computed: {
			dialog: {
				get() {
					return this.modelValue;
				},
				set(value: boolean) {
					this.$emit("update:modelValue", value);
				},
			},
			isEditing(): boolean {
				return !!this.product;
			},
		},
		watch: {
			product: {
				handler(newProduct: Product | null) {
					if (newProduct) {
						this.productForm = {
							name: newProduct.name,
							price: newProduct.price,
							categoryId: newProduct.category.id,
							description: (newProduct as any).description || "",
						};
					} else {
						this.resetForm();
					}
				},
				immediate: true,
			},
		},
		methods: {
			closeDialog() {
				this.dialog = false;
				this.resetForm();
			},
			resetForm() {
				this.productForm = {
					name: "",
					price: 0,
					categoryId: null,
					description: "",
				};
				if (this.$refs.form) {
					(this.$refs.form as any).resetValidation();
				}
			},
			saveProduct() {
				if (this.valid) {
					this.$emit("save", {
						...this.productForm,
						id: this.product?.id,
					});
				}
			},
		},
	});
</script>
