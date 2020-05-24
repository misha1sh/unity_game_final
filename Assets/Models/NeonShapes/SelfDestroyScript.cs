using UnityEngine;

public class SelfDestroyScript : MonoBehaviour 
{
	
	void Start () 
	{
		Destroy (gameObject, 0.0f);
	}
}
