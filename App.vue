<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/* Common CSS for every page */
	page {
		background-color: #ffffff;
		font-size: 18px;
		color: #333333;
	}
	
	/* Normal button style */
	.btn-normal {
		width: 80px;
		height: 60px;
		border-radius: 8px;
		border: 1px solid #87ceeb;
		background-color: #1e90ff;
		color: #ffffff;
		font-size: 18px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	/* Primary button style */
	.btn-primary {
		width: 120px;
		height: 120px;
		border-radius: 50%;
		border: 1px solid #87ceeb;
		color: #ffffff;
		font-size: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	/* Card style */
	.card {
		border-radius: 8px;
		background-color: #98fb98;
		border: 1px solid #d3d3d3;
		padding: 16px;
		margin-bottom: 16px;
	}
	
	/* List item style */
	.list-item {
		border-radius: 8px;
		background-color: #98fb98;
		border: 1px solid #d3d3d3;
		padding: 16px;
		margin-bottom: 8px;
	}
</style>
