using UnityEngine;

public class FunCameraRotator : MonoBehaviour {
    public Vector3 speed;
    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update() {
        Vector3 dp = speed * Time.deltaTime;
        transform.Rotate(dp);
    }
}
