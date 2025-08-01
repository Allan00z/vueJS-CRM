<template>
	<div class="register-form">
		<h2>Créer un compte</h2>
		<form @submit.prevent="handleSubmit">
			<div class="form-group">
				<label for="firstName">Prénom</label>
				<input v-model="form.firstName" type="text" id="firstName" required />
			</div>

			<div class="form-group">
				<label for="lastName">Nom</label>
				<input v-model="form.lastName" type="text" id="lastName" required />
			</div>

			<div class="form-group">
				<label for="email">Email</label>
				<input v-model="form.email" type="email" id="email" required />
			</div>

			<div class="form-group">
				<label for="password">Mot de passe</label>
				<input v-model="form.password" type="password" id="password" required />
			</div>

			<button type="submit" :disabled="loading">
				{{ loading ? "Création en cours..." : "Créer un compte" }}
			</button>
		</form>
	</div>
</template>

<script lang="ts">
	import { defineComponent, reactive } from "vue";
	import AuthService from "@/services/auth.service";

	interface RegisterForm {
		firstName: string;
		lastName: string;
		email: string;
		password: string;
	}

	export default defineComponent({
		name: "Register",
		data() {
			return {
				form: reactive<RegisterForm>({
					firstName: "",
					lastName: "",
					email: "",
					password: "",
				}),
				loading: false,
			};
		},
		methods: {
			async handleSubmit() {
				this.loading = true;

				try {
					const response = await AuthService.register(
						this.form.firstName,
						this.form.lastName,
						this.form.email,
						this.form.password
					);
					console.log("Succès:", response.data);
					await AuthService.login(this.form.email, this.form.password);
					// Redirection vers le dashboard ou la page d'accueil
					this.$router.push("/");
				} catch (error: any) {
					console.error("Erreur:", error.response?.data || error.message);
				}
			},
		},
	});
</script>

<style scoped>
	.register-form {
		max-width: 400px;
		margin: 0 auto;
		padding: 1.5rem;
		border: 1px solid #ddd;
		border-radius: 10px;
	}

	.form-group {
		margin-bottom: 1rem;
	}

	label {
		display: block;
		margin-bottom: 0.25rem;
		font-weight: bold;
	}

	input {
		width: 100%;
		padding: 0.5rem;
		border-radius: 6px;
		border: 1px solid #ccc;
	}

	button {
		width: 100%;
		padding: 0.75rem;
		background-color: #42b983;
		color: white;
		border: none;
		border-radius: 6px;
		font-weight: bold;
		cursor: pointer;
	}

	button:hover {
		background-color: #369b74;
	}
</style>
