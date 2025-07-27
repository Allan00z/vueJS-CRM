<template>
	<div class="admin-users">
		<div class="header-actions">
			<h2>Gestion des utilisateurs</h2>
		</div>
		<v-card>
			<v-data-table
				:headers="headers"
				:items="users"
				:loading="loading"
				class="elevation-1"
			>
				<template v-slot:item.isAdmin="{ item }">
					<v-switch
						v-model="item.isAdmin"
						:label="item.isAdmin ? 'Admin' : 'Utilisateur'"
						@change="toggleAdmin(item)"
						color="primary"
						hide-details
						:disabled="isCurrentUser(item)"
					/>
				</template>
			</v-data-table>
		</v-card>
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
	import { User } from "@/assets/types/user";
	import UserService from "@/services/user.service";
	import { authStore } from "@/stores/auth";

	export default defineComponent({
		name: "AdminUsers",
		data() {
			return {
				users: [] as User[],
				loading: false,
				showSnackbar: false,
				snackbarMessage: "",
				snackbarColor: "success",
				headers: [
					{ title: "Nom", key: "lastName", sortable: true },
					{ title: "Prénom", key: "firstName", sortable: true },
					{ title: "Email", key: "email", sortable: true },
					{ title: "Admin", key: "isAdmin", sortable: false },
				],
			};
		},
		async mounted() {
			await this.loadUsers();
		},
		methods: {
			async loadUsers() {
				this.loading = true;
				try {
					const response = await UserService.getAll();
					this.users = response.data;
				} catch (error) {
					this.showNotification(
						"Erreur lors du chargement des utilisateurs",
						"error"
					);
				} finally {
					this.loading = false;
				}
			},
			async toggleAdmin(user: User) {
				try {
					if (user?.id === undefined || user?.id === null) {
						throw new Error("Pas d'id");
					}
					await UserService.update(user.id, { isAdmin: user.isAdmin });
					this.showNotification("Statut administrateur modifié", "success");
				} catch (error) {
					this.showNotification(
						"Erreur lors de la modification du statut",
						"error"
					);
					await this.loadUsers();
				}
			},
			isCurrentUser(user: User) {
				return user.id === authStore.state.user?.userId;
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
	.admin-users {
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
