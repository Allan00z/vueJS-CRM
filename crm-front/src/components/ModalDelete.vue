<template>
	<v-dialog v-model="dialog" max-width="400">
		<v-card>
			<v-card-title class="text-h5">
				<v-icon color="warning" class="mr-2">mdi-alert</v-icon>
				Confirmation de suppression
			</v-card-title>

			<v-card-text>
				<p>{{ message }}</p>
			</v-card-text>

			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="grey-darken-1" variant="text" @click="closeDialog">
					Annuler
				</v-btn>
				<v-btn
					color="error"
					variant="elevated"
					@click="confirmDelete"
					:loading="loading"
				>
					Supprimer
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script lang="ts">
	import { defineComponent } from "vue";

	export default defineComponent({
		name: "ModalDelete",
		props: {
			modelValue: {
				type: Boolean,
				default: false,
			},
			message: {
				type: String,
				default: "Êtes-vous sûr de vouloir supprimer cet élément ?",
			},
			loading: {
				type: Boolean,
				default: false,
			},
		},
		emits: ["update:modelValue", "confirm"],
		computed: {
			dialog: {
				get() {
					return this.modelValue;
				},
				set(value: boolean) {
					this.$emit("update:modelValue", value);
				},
			},
		},
		methods: {
			closeDialog() {
				this.dialog = false;
			},
			confirmDelete() {
				this.$emit("confirm");
			},
		},
	});
</script>

<style scoped>
	.v-card-title {
		display: flex;
		align-items: center;
	}
</style>
