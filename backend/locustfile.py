from locust import HttpUser, task, between
import json
import os

class FraudPredictionTestUser(HttpUser):
    """
    Locust user simulating API interaction for fraud detection.
    """
    wait_time = between(1, 3)  # Pause between tasks (in seconds)

    # Sample data for single prediction
    prediction_data = {
        "distance_from_home": 5.0,
        "distance_from_last_transaction": 10.0,
        "ratio_to_median_purchase_price": 1.5,
        "repeat_retailer": 1,
        "used_chip": 0,
        "used_pin_number": 1,
        "online_order": 0,
    }

    # Bulk prediction payload
    bulk_prediction_data = [
        {
            "distance_from_home": 5.0,
            "distance_from_last_transaction": 10.0,
            "ratio_to_median_purchase_price": 1.5,
            "repeat_retailer": 1,
            "used_chip": 0,
            "used_pin_number": 1,
            "online_order": 0,
        },
        {
            "distance_from_home": 8.0,
            "distance_from_last_transaction": 5.0,
            "ratio_to_median_purchase_price": 1.8,
            "repeat_retailer": 0,
            "used_chip": 1,
            "used_pin_number": 0,
            "online_order": 1,
        },
    ]

    @task(2)  # Weight of 2: This task runs more often
    def predict_single(self):
        """
        Test the /predict endpoint with a single prediction payload.
        """
        self.client.post("/predict", json=self.prediction_data)

    @task(1)  # Weight of 1: This task runs less often
    def predict_bulk(self):
        """
        Test the /predict endpoint with a bulk prediction payload.
        """
        self.client.post("/predict", json=self.bulk_prediction_data)

    @task(2)
    def upload_file(self):
        """
        Test the /upload endpoint with a sample CSV file.
        """
        sample_file_path = "sample_data.csv"

        # Ensure the sample file exists
        if not os.path.exists(sample_file_path):
            with open(sample_file_path, "w") as f:
                f.write("distance_from_home,distance_from_last_transaction,ratio_to_median_purchase_price,repeat_retailer,used_chip,used_pin_number,online_order\n")
                f.write("5.0,10.0,1.5,1,0,1,0\n")
                f.write("8.0,5.0,1.8,0,1,0,1\n")

        with open(sample_file_path, "rb") as file:
            self.client.post("/upload", files={"file": file})

    @task(1)
    def retrain_model(self):
        """
        Test the /retrain endpoint to trigger model retraining.
        """
        self.client.post("/retrain")

    @task(1)
    def stress_test_combined(self):
        """
        Stress test: Combine multiple endpoints in a single task.
        """
        # Single prediction
        self.predict_single()
        # File upload
        self.upload_file()
        # Model retraining
        self.retrain_model()
