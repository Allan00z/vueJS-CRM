<template>
	<v-dialog v-model="dialog" max-width="500" persistent>
		<v-card>
			<v-card-title class="text-h5">
				<v-icon color="primary" class="mr-2">
					{{ isEditing ? "mdi-pencil" : "mdi-plus" }}
				</v-icon>
				{{ isEditing ? "Modifier la catégorie" : "Ajouter une catégorie" }}
			</v-card-title>

			<v-card-text>
				<v-form ref="form" v-model="valid">
					<v-row>
						<v-col cols="12">
							<v-text-field
								v-model="categoryForm.name"
								label="Nom de la catégorie"
								:rules="[rules.required]"
								required
								variant="outlined"
							></v-text-field>
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
					@click="saveCategory"
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
	import { Category } from "@/assets/types/category";

	interface CategoryForm {
		name: string;
		description: string;
	}

	export default defineComponent({
		name: "ModalCategory",
		props: {
			modelValue: {
				type: Boolean,
				default: false,
			},
			category: {
				type: Object as () => Category | null,
				default: null,
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
				categoryForm: {
					name: "",
					description: "",
				} as CategoryForm,
				rules: {
					required: (value: any) => !!value || "Ce champ est requis",
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
				return !!this.category;
			},
		},
		watch: {
			category: {
				handler(newCategory: Category | null) {
					if (newCategory) {
						this.categoryForm = {
							name: newCategory.name,
							description: (newCategory as any).description || "",
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
				this.categoryForm = {
					name: "",
					description: "",
				};
				if (this.$refs.form) {
					(this.$refs.form as any).resetValidation();
				}
			},
			saveCategory() {
				if (this.valid) {
					this.$emit("save", {
						...this.categoryForm,
						id: this.category?.id,
					});
				}
			},
		},
	});
</script>
